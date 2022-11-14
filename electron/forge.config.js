module.exports = {
  packagerConfig: {
    icon: "./build/favicon.ico",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "HiThere157",
          name: "Ad-Tools",
        },
        prerelease: false,
        draft: true,
      },
    },
  ],
};
