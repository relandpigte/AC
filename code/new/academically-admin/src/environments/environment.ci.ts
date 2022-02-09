export const environment = {
  production: false,
  hmr: false,
  appConfig: 'appconfig.ci.json',
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
      username: 'turn_user',
      password: 'Wsc4e9dnckso1ejz97zorjf',
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
        bucket: 'academically-gitlab-ci-assets',
        securedBucket: 'academically-gitlab-ci-assets-secure',
        credentials: {
          accessKey: 'AKIA3CV3YWZBN7ZGDVHT',
          secret: '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',
        },
        folders: {
          video: 'videos',
          videoThumbnail: 'video-thumbnails',
          articleThumbnail: 'article-thumbnails',
          courseSectionImage: 'course-section-images',
        },
      },
    },
  },
};
