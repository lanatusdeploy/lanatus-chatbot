// Attempt silent refresh using google.accounts.id.prompt()
// Returns a Promise that resolves to new id token (string) or rejects.
export function refreshToken() {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      return reject(new Error("Google Identity Services not loaded"));
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (res) => {
          if (res && res.credential) {
            resolve(res.credential);
          } else {
            reject(new Error("No credential from prompt"));
          }
        },
      });
      window.google.accounts.id.prompt(); 
    } catch (err) {
      reject(err);
    }
  });
}
