# Persistent service law

The handoff record must include:

- branch and full commit;
- production build timestamp and dist path/hash;
- persistent service identifier, PID, port, and log paths;
- health URL and response;
- current LAN IP and Bonjour hostname resolution;
- walk URL and recorder URL with every required query parameter;
- fresh-WebKit result, console errors, world-ready status, and critical asset fetch status;
- receiver status and last accepted artifact when applicable.

If the process dies, inspect and quote the relevant log interval before restarting. If the app is black or incomplete, debug runtime assembly; do not report success from HTTP status alone.
