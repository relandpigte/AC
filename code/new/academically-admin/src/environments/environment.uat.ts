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
        'stun:turn-uat.academically-dev.uk:3478',
        'stun:[2001:4860:4864:4:8000::]:3478',
      ]
    },
    turn: {
      servers: [
        'turn:turn-uat.academically-dev.uk:3478?transport=udp',
        'turn:[2001:4860:4864:4:8000::]:3478?transport=udp',
        'turn:turn-uat.academically-dev.uk:3478?transport=tcp',
        'turn:[2001:4860:4864:4:8000::]:3478?transport=tcp',
      ],
      username: 'acad_turn_user',
      password: 'cd33s:3s0f.B2BfdGDVV2alS',
    }
  },
  providers: {
    stripe: {
      clientId: 'ca_JTqXUdOGoHuPu5xa30NV6ywErQwqkFrO',
      courseSectionImage: 'course-section-images',
      onbloardLink: (clientId: string, host: string) => `https://connect.stripe.com/express/oauth/authorize?response_type=code&scope=read_write&client_id=${clientId}&redirect_uri=${host}/app/dashboard`,
    },
    amazon: {
      s3: {
        region: 'eu-west-2',
        bucket: 'academically-uat-assets',
        securedBucket: 'academically-uat-assets-secure',
        credentials: {
          accessKey: 'AKIA3CV3YWZBN7ZGDVHT',
          secret: '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',
        },
      },
    },
  },
};
