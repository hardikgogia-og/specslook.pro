import type { Product, Category, StoreLocation, Order, Coupon, BlogPost, Banner, Customer, Review } from '../types.ts';

export interface DatabaseSchema {
  products: Product[];
  categories?: Category[];
  stores?: StoreLocation[];
  orders?: Order[];
  coupons?: Coupon[];
  blogs?: BlogPost[];
  banners?: Banner[];
  customers?: Customer[];
  reviews?: Review[];
  admin?: any;
}

export function parseGitHubRepo(repoStr: string): { owner: string; repo: string } | null {
  if (!repoStr) return null;
  const clean = repoStr
    .trim()
    .replace(/^https?:\/\/github\.com\//i, '')
    .replace(/\.git$/i, '')
    .replace(/^\/+|\/+$/g, '');
  const parts = clean.split('/');
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return { owner: parts[0].trim(), repo: parts[1].trim() };
  }
  return null;
}

export function getStoredGitHubCredentials(): { token: string; repo: string; owner: string; repoName: string } | null {
  try {
    const token = (
      localStorage.getItem('specslook_github_pat') ||
      localStorage.getItem('specslook_github_token') ||
      ''
    ).trim();
    const repo = (localStorage.getItem('specslook_github_repo') || '').trim();

    if (!token || !repo) return null;

    const parsed = parseGitHubRepo(repo);
    if (!parsed) return null;

    return {
      token: token.replace(/^(bearer|token)\s+/i, '').trim(),
      repo,
      owner: parsed.owner,
      repoName: parsed.repo
    };
  } catch {
    return null;
  }
}

/**
 * Robust UTF-8 to Base64 encoder supporting emojis, currency symbols (₹), and special characters
 */
export function utf8ToBase64(str: string): string {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  } catch {
    // Fallback using TextEncoder if available
    if (typeof TextEncoder !== 'undefined') {
      const bytes = new TextEncoder().encode(str);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }
    return btoa(unescape(encodeURIComponent(str)));
  }
}

/**
 * Robust Base64 to UTF-8 decoder
 */
export function base64ToUtf8(str: string): string {
  const clean = str.replace(/[\r\n\s]/g, '');
  try {
    return decodeURIComponent(
      atob(clean)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    // Fallback using TextDecoder if available
    if (typeof TextDecoder !== 'undefined') {
      const binary = atob(clean);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    }
    return decodeURIComponent(escape(atob(clean)));
  }
}

const FILE_PATH = 'data/specslook_db.json';

/**
 * Tests connection directly to GitHub REST API from the browser.
 * Bypasses backend/Vercel serverless functions so it NEVER fails with HTML 404 / JSON parsing errors.
 */
export async function testGitHubConnectionDirect(
  token: string,
  repoPath: string
): Promise<{
  connected: boolean;
  owner?: string;
  repo?: string;
  sha?: string;
  message?: string;
  error?: string;
}> {
  const cleanToken = token.replace(/^(bearer|token)\s+/i, '').trim();
  const parsed = parseGitHubRepo(repoPath);

  if (!cleanToken) {
    return {
      connected: false,
      error: 'GitHub Personal Access Token (PAT) is required.'
    };
  }

  if (!parsed) {
    return {
      connected: false,
      error: 'Invalid repository path. Expected format: "owner/repo" (e.g. "username/specslook-store").'
    };
  }

  const { owner, repo } = parsed;
  const headers = {
    Authorization: `Bearer ${cleanToken}`,
    Accept: 'application/vnd.github.v3+json'
  };

  try {
    // 1. Verify Repository existence and token access
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      method: 'GET',
      headers
    });

    if (repoRes.status === 401) {
      return {
        connected: false,
        owner,
        repo,
        error: 'Unauthorized (401): The GitHub PAT is invalid or expired. Please check or regenerate your token.'
      };
    }

    if (repoRes.status === 404) {
      return {
        connected: false,
        owner,
        repo,
        error: `Repository "${owner}/${repo}" was not found (404). Ensure the repo name is spelled correctly and that the PAT has permission to access it.`
      };
    }

    if (repoRes.status === 403) {
      const errData = await repoRes.json().catch(() => ({}));
      return {
        connected: false,
        owner,
        repo,
        error: `Access Forbidden (403): ${errData.message || 'Rate limit reached or missing repository permissions. Ensure PAT has repo/contents write scope.'}`
      };
    }

    if (!repoRes.ok) {
      const errData = await repoRes.json().catch(() => ({}));
      return {
        connected: false,
        owner,
        repo,
        error: `GitHub error (HTTP ${repoRes.status}): ${errData.message || 'Failed to access repository.'}`
      };
    }

    const repoInfo = await repoRes.json().catch(() => ({}));
    const defaultBranch = repoInfo.default_branch || 'main';

    // 2. Check data/specslook_db.json file
    const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${FILE_PATH}`, {
      method: 'GET',
      headers
    });

    if (fileRes.status === 200) {
      const fileData = await fileRes.json();
      return {
        connected: true,
        owner,
        repo,
        sha: fileData.sha,
        message: `Successfully connected to repository ${owner}/${repo} on branch "${defaultBranch}". File "${FILE_PATH}" verified with SHA ${fileData.sha?.substring(0, 7)}.`
      };
    }

    if (fileRes.status === 404) {
      return {
        connected: true,
        owner,
        repo,
        message: `Connected to repository ${owner}/${repo} on branch "${defaultBranch}". Note: "${FILE_PATH}" not yet in repo — it will be created automatically on your first product save!`
      };
    }

    // Other status
    const fileErr = await fileRes.json().catch(() => ({}));
    return {
      connected: true,
      owner,
      repo,
      message: `Connected to repository ${owner}/${repo}. File check note: ${fileErr.message || 'Status ' + fileRes.status}`
    };
  } catch (netErr: any) {
    return {
      connected: false,
      owner,
      repo,
      error: `Network error connecting directly to GitHub API: ${netErr.message || 'Check your internet connection.'}`
    };
  }
}

/**
 * Fetches the current catalog JSON from GitHub repository contents.
 */
export async function fetchCatalogFromGitHub(
  token?: string,
  repoPath?: string
): Promise<{ schema: DatabaseSchema; sha?: string } | null> {
  const creds = getStoredGitHubCredentials();
  const activeToken = token ? token.replace(/^(bearer|token)\s+/i, '').trim() : creds?.token;
  const activeRepo = repoPath || creds?.repo;

  if (!activeToken || !activeRepo) return null;

  const parsed = parseGitHubRepo(activeRepo);
  if (!parsed) return null;

  const { owner, repo } = parsed;
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${FILE_PATH}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${activeToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (res.status === 200) {
      const fileData = await res.json();
      if (fileData.content) {
        const decoded = base64ToUtf8(fileData.content);
        const parsedJson = JSON.parse(decoded);
        return {
          schema: parsedJson,
          sha: fileData.sha
        };
      }
    }
  } catch (err) {
    console.warn('[GitHub Git Service] Could not fetch catalog from GitHub:', err);
  }
  return null;
}

/**
 * Directly commits updated products catalog to GitHub repository contents.
 * Works on Vercel, localhost, Cloud Run, GitHub Pages, or any client browser environment.
 */
export async function syncCatalogToGitHubDirect(params: {
  action: 'create' | 'update' | 'delete';
  productName: string;
  allProducts: Product[];
  categories?: Category[];
  stores?: StoreLocation[];
  token?: string;
  repo?: string;
}): Promise<{ success: boolean; sha?: string; message?: string }> {
  const creds = getStoredGitHubCredentials();
  const activeToken = params.token
    ? params.token.replace(/^(bearer|token)\s+/i, '').trim()
    : creds?.token;
  const activeRepo = params.repo || creds?.repo;

  if (!activeToken || !activeRepo) {
    console.log('[GitHub Git Service] No GitHub credentials saved; skipping direct GitHub commit.');
    return { success: true, message: 'Saved to local browser storage only' };
  }

  const parsed = parseGitHubRepo(activeRepo);
  if (!parsed) {
    throw new Error(`Invalid repository path: "${activeRepo}". Expected format: "owner/repo".`);
  }

  const { owner, repo } = parsed;
  const headers = {
    Authorization: `Bearer ${activeToken}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${FILE_PATH}`;

  // 1. Fetch current file to get existing SHA and preserve categories/stores/orders
  let currentSha: string | undefined;
  let currentSchema: Partial<DatabaseSchema> = {};

  try {
    const getRes = await fetch(fileUrl, {
      method: 'GET',
      headers
    });

    if (getRes.status === 200) {
      const fileData = await getRes.json();
      currentSha = fileData.sha;
      if (fileData.content) {
        try {
          const decoded = base64ToUtf8(fileData.content);
          currentSchema = JSON.parse(decoded);
        } catch (e) {
          console.warn('[GitHub Git Service] Could not decode existing schema:', e);
        }
      }
    } else if (getRes.status === 404) {
      console.log('[GitHub Git Service] data/specslook_db.json does not exist yet. Initializing new file.');
    } else {
      const errJson = await getRes.json().catch(() => ({}));
      throw new Error(`GitHub API error (${getRes.status}): ${errJson.message || 'Could not access file.'}`);
    }
  } catch (err: any) {
    if (err.message?.includes('GitHub API error')) throw err;
    console.warn('[GitHub Git Service] Network error fetching SHA from GitHub:', err);
  }

  // 2. Build full updated DatabaseSchema
  const updatedSchema: DatabaseSchema = {
    ...currentSchema,
    products: params.allProducts,
    categories: params.categories || currentSchema.categories || [],
    stores: params.stores || currentSchema.stores || []
  };

  // 3. Serialize and Encode to Base64
  const jsonString = JSON.stringify(updatedSchema, null, 2);
  const base64Content = utf8ToBase64(jsonString);

  const actionVerb = params.action === 'create' ? 'Add' : (params.action === 'update' ? 'Update' : 'Delete');
  const commitMessage = `chore(inventory): ${actionVerb} "${params.productName}" via Specslook Admin`;

  const commitBody: any = {
    message: commitMessage,
    content: base64Content
  };
  if (currentSha) {
    commitBody.sha = currentSha;
  }

  // 4. PUT commit to GitHub Contents REST API
  const putRes = await fetch(fileUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify(commitBody)
  });

  if (!putRes.ok) {
    const putErr = await putRes.json().catch(() => ({}));
    throw new Error(`GitHub commit failed (HTTP ${putRes.status}): ${putErr.message || 'Check PAT token permissions for "repo" or "contents:write"'}`);
  }

  const putData = await putRes.json().catch(() => ({}));
  const newSha = putData?.content?.sha || putData?.commit?.sha || currentSha;

  console.log(`[GitHub Git Service] Successfully committed to ${owner}/${repo} at ${FILE_PATH} (SHA: ${newSha})`);

  return {
    success: true,
    sha: newSha,
    message: `Committed update to GitHub repository ${owner}/${repo} (SHA: ${newSha?.substring(0, 7)})`
  };
}
