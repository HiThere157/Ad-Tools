type Release = {
  html_url: string;
  name: string;
  body: string;
  prerelease: boolean;
  published_at: string;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
};
