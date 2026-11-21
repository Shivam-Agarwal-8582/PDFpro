/**
 * Format raw bytes into human-readable format (KB, MB, GB).
 */
export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Upload and compress a PDF file with progress monitoring.
 * @param {File} file - PDF file object
 * @param {string} level - 'low' | 'recommended' | 'high'
 * @param {Function} onProgress - Progress callback receiving percentage (0-100)
 * @returns {Promise<Object>} API response data
 */
export function compressPDF(file, level = 'recommended', onProgress = () => {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('level', level);

    xhr.open('POST', `${API_BASE_URL}/api/compress/upload`, true);

    // Track upload progress (0% to 70% of overall flow)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 70);
        onProgress(percentComplete, 'Uploading PDF...');
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            onProgress(100, 'Done!');
            resolve(response.data);
          } else {
            reject(new Error(response.message || 'Compression failed'));
          }
        } catch (err) {
          reject(new Error('Invalid response from compression server'));
        }
      } else {
        let errorMsg = `Server error (${xhr.status})`;
        try {
          const errorResp = JSON.parse(xhr.responseText);
          if (errorResp.message) errorMsg = errorResp.message;
        } catch {
          // keep generic
        }
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error: Unable to connect to compression server. Please check if the backend is running.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Request timed out. Please try with a smaller PDF file.'));
    };

    xhr.send(formData);
  });
}

/**
 * Check backend server health.
 */
export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}
