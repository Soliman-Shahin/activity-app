import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      // set config at nuxeo server
      config: {
        url: 'http://35.153.66.52/auth',
        realm: 'nuxeo',
        clientId: 'meeting-web',
      },
      // to set config at port 8080
      // config: {
      //   url: 'http://localhost:8080/auth',
      //   realm: 'test-app',
      //   clientId: 'test-app-client',
      // },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
      // loadUserProfileAtStartUp: true,
    });
}
