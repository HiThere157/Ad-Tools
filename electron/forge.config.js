module.exports = {
  packagerConfig: {
    icon: "./assets/icon64.ico",
    name: "AD Tools",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-wix",
      config: {
        "features": {
          autoUpdate: true
        }
      },
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
