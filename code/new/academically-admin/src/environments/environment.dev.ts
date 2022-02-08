// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  hmr: false,
  appConfig: 'appconfig.dev.json',
  googleApiKey: 'AIzaSyBtYaldOOmA-wNFOI7f32MvYSYGkaLAz6k',
  agora: {
    appId: '61dfaf37a1ca4dfdb89d305d29914a09',
    appCertificate: '37b27c2d394341b19886a401211c16d8',
  },
  webRtc: {
    stun: {
      servers: [
        'stun:74.125.247.128:3478',
        'stun:[2001:4860:4864:4:8000::]:3478',
      ]
    },
    turn: {
      servers: [
        'turn:74.125.247.128:3478?transport=udp',
        'turn:[2001:4860:4864:4:8000::]:3478?transport=udp',
        'turn:74.125.247.128:3478?transport=tcp',
        'turn:[2001:4860:4864:4:8000::]:3478?transport=tcp',
      ],
      username: 'CJL8kokGEgZ9eARpCUwYqvGggqMKIICjBTAK',
      password: 'DyyYyerG+RbPOlWQg3El0vJTaCY=',
    }
  },
  providers: {
    stripe: {
      clientId: 'ca_JTqXUdOGoHuPu5xa30NV6ywErQwqkFrO',
      onbloardLink: (clientId: string, host: string) => `https://connect.stripe.com/express/oauth/authorize?response_type=code&scope=read_write&client_id=${clientId}&redirect_uri=${host}/app/dashboard`,
    },
    amazon: {
      s3: {
        region: 'eu-west-2',
        bucket: 'academically-local-assets',
        securedBucket: 'academically-local-assets-secured',
        credentials: {
          accessKey: 'AKIA3CV3YWZBC24YH5U5',
          secret: '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',
        },
        folders: {
          video: 'videos',
          videoThumbnail: 'video-thumbnails',
          articleThumbnail: 'article-thumbnails',
        },
      },
    },
  },
};
