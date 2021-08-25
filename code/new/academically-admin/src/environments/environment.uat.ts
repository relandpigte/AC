export const environment = {
  production: false,
  hmr: false,
  appConfig: 'appconfig.uat.json',
  googleApiKey: 'AIzaSyBtYaldOOmA-wNFOI7f32MvYSYGkaLAz6k',
  agora: {
    appId: '61dfaf37a1ca4dfdb89d305d29914a09',
    appCertificate: '37b27c2d394341b19886a401211c16d8',
  },
  webRtc: {
    stun: {
      servers: [
        'stun:turn-academically-gitlab-ci.sourcecloud-dev.uk:3478',
      ]
    },
    turn: {
      servers: [
        'turn:turn-academically-gitlab-ci.sourcecloud-dev.uk:3478?transport=udp',
        'turn:turn-academically-gitlab-ci.sourcecloud-dev.uk:3478?transport=tcp',
      ],
      username: '',
      password: '',
    }
  },
  providers: {
    stripe: {
      clientId: 'ca_JTqXUdOGoHuPu5xa30NV6ywErQwqkFrO',
      onbloardLink: (clientId: string, host: string) => `https://connect.stripe.com/oauth/authorize?response_type=code&scope=read_write&client_id=${clientId}&redirect_uri=${host}/app/account-settings/general`,
    }
  },
};
