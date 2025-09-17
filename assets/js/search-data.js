// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "A list of my publications in reversed chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of my cool projects!",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "post-towards-better-row-hammer-mitigation-through-dynamic-aggressor-row-quarantining",
        
          title: "Towards Better Row-Hammer Mitigation through Dynamic Aggressor Row Quarantining",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/moinuddin-qureshi-interview/";
          
        },
      },{id: "post-forged-in-sparks-the-story-of-bramhaputra-the-battlebot",
        
          title: "Forged in Sparks: The Story of Bramhaputra the BattleBot",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2020/bramhaputra/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "projects-game-of-life",
          title: 'Game of Life',
          description: "a terminal-based version of the popular Conway&#39;s game of life",
          section: "Projects",handler: () => {
              window.location.href = "/projects/game-of-life/";
            },},{id: "projects-risc-v-atom",
          title: 'RISC-V Atom',
          description: "An open-source 32-bit RISC-V soft-core processor.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/riscv-atom/";
            },},{id: "projects-vortex-debug-extension",
          title: 'Vortex Debug Extension',
          description: "External debug spec for Vortex GPGPU",
          section: "Projects",handler: () => {
              window.location.href = "/projects/vortex_debug/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%73%61%75%72%61%62%68.%73@%67%61%74%65%63%68.%65%64%75", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/saursin", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/saursin", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0001-6974-3142", "_blank");
        },
      },{
        id: 'social-researchgate',
        title: 'ResearchGate',
        section: 'Socials',
        handler: () => {
          window.open("https://www.researchgate.net/profile/Saurabh-Singh-183/", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=KjIFg1IAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
