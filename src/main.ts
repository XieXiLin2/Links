import friendsData from "../links.json";
import "./style.css";

type FriendLink = {
  name: string;
  link: string;
};

type Friend = {
  avatar: string;
  name: string;
  banner: string;
  links: FriendLink[];
};

type Child = Node | string | null | undefined | false | Child[];

const friends = (friendsData as Friend[]).map((friend) => ({
  ...friend,
  avatar: friend.avatar.trim(),
  links: friend.links.map((link) => ({
    ...link,
    link: link.link.trim(),
  })),
}));

const site = {
  name: "XieXiLin 的小站",
  owner: "XieXiLin",
  description: "一个学生的小站点。",
  url: "https://www.xiexilin.com",
  avatar: "https://static.xiexilin.com/Me.png",
  defaultAvatar: `${import.meta.env.BASE_URL}attets/img/Transparent_Akkarin.jpg`,
  themeColor: "#00CCFF",
  gravatarHash: "2defd5540f480625cf9d09e5d4c3b7c4",
  repository: "https://github.com/XieXiLin2/Links",
  icp: {
    moeicp: {
      label: "MoeICP 备 20220031 号",
      url: "https://icp.gov.moe/?keyword=20220031",
      icon: `${import.meta.env.BASE_URL}attets/img/moeicp-icon.png`,
    },
    miit: {
      label: "粤 ICP 备 2026067291 号",
      url: "https://beian.miit.gov.cn/",
    },
  },
};

const app = getApp();

const state = {
  query: "",
};

const stats = [
  { label: "友链", value: String(friends.length) },
  {
    label: "站点入口",
    value: String(friends.reduce((total, friend) => total + friend.links.length, 0)),
  },
  { label: "主题色", value: site.themeColor },
];

render();

function render() {
  app.replaceChildren(createPage());
}

function createPage() {
  return element("div", { className: "page" }, [
    createHeader(),
    createHero(),
    createFriendsSection(),
    createInfoSection(),
    createFooter(),
  ]);
}

function createHeader() {
  return element("header", { className: "site-header" }, [
    element("a", { className: "brand", href: site.url, target: "_blank" }, [
      createAvatar(site.avatar, "XieXiLin 的头像", "brand__avatar"),
      element("span", { className: "brand__text" }, [
        element("strong", {}, [site.owner]),
        element("span", {}, ["友链"]),
      ]),
    ]),
    element("nav", { className: "site-nav", ariaLabel: "页面导航" }, [
      createTextLink("#friends", "小伙伴"),
      createTextLink("#join", "加入"),
      createTextLink(site.repository, "GitHub", true),
    ]),
  ]);
}

function createHero() {
  return element("section", { className: "hero", ariaLabelledby: "page-title" }, [
    element("div", { className: "hero__copy" }, [
      element("p", { className: "eyebrow" }, ["Friends & Neighbors"]),
      element("h1", { id: "page-title" }, ["我的小伙伴们"]),
      element("p", { className: "lead" }, [
        "这里收录了一些有趣、认真、还在持续发光的小站。欢迎顺着链接去看看，也欢迎来交换友链。",
      ]),
      element("div", { className: "hero__actions" }, [
        createButtonLink("#friends", "查看友链", "primary"),
        createButtonLink("#join", "交换友链", "secondary"),
      ]),
    ]),
    element("div", { className: "hero__visual", ariaHidden: "true" }, [
      createAvatar(site.avatar, "", "hero__portrait"),
      element("div", { className: "hero__stats" }, [
        ...stats.map((item) =>
          element("div", { className: "stat" }, [
            element("span", { className: "stat__value" }, [item.value]),
            element("span", { className: "stat__label" }, [item.label]),
          ]),
        ),
      ]),
    ]),
  ]);
}

function createFriendsSection() {
  const filteredFriends = getFilteredFriends();
  const countText =
    state.query.trim().length > 0
      ? `找到 ${filteredFriends.length} 个匹配的小站`
      : `共 ${friends.length} 个小站`;

  return element("main", { className: "main" }, [
    element("section", { id: "friends", className: "friends-section", ariaLabelledby: "friends-title" }, [
      element("div", { className: "section-heading" }, [
        element("div", {}, [
          element("p", { className: "eyebrow" }, ["Links"]),
          element("h2", { id: "friends-title" }, ["伙伴们的信息"]),
        ]),
        createSearch(countText),
      ]),
      filteredFriends.length > 0
        ? element("div", { className: "friends-grid" }, filteredFriends.map(createFriendCard))
        : createEmptyState(),
    ]),
  ]);
}

function createSearch(countText: string) {
  const input = element("input", {
    ariaLabel: "搜索友链",
    className: "search__input",
    placeholder: "搜索名字、签名或入口",
    type: "search",
    value: state.query,
  }) as HTMLInputElement;

  input.addEventListener("input", () => {
    state.query = input.value;
    render();
    const nextInput = document.querySelector<HTMLInputElement>(".search__input");
    nextInput?.focus();
    nextInput?.setSelectionRange(state.query.length, state.query.length);
  });

  const clearButton = element(
    "button",
    {
      ariaLabel: "清空搜索",
      className: "search__clear",
      hidden: state.query.trim().length === 0,
      type: "button",
    },
    ["清空"],
  );

  clearButton.addEventListener("click", () => {
    state.query = "";
    render();
    document.querySelector<HTMLInputElement>(".search__input")?.focus();
  });

  return element("div", { className: "search" }, [
    element("label", { className: "search__label" }, ["搜索友链"]),
    element("div", { className: "search__field" }, [input, clearButton]),
    element("p", { className: "search__count", ariaLive: "polite" }, [countText]),
  ]);
}

function createFriendCard(friend: Friend) {
  return element("article", { className: "friend-card" }, [
    element("div", { className: "friend-card__body" }, [
      createAvatar(friend.avatar, `${friend.name} 的头像`, "friend-card__avatar"),
      element("div", { className: "friend-card__content" }, [
        element("h3", { className: "friend-card__name" }, [friend.name]),
        element("p", { className: "friend-card__banner" }, [friend.banner]),
      ]),
    ]),
    element("div", { className: "friend-card__links" }, [
      ...friend.links.map((link) => createPillLink(link.link, link.name)),
    ]),
  ]);
}

function createInfoSection() {
  return element("section", { className: "info-band", ariaLabel: "友链交换信息" }, [
    element("div", { id: "join", className: "info-layout" }, [
      element("section", { className: "info-block", ariaLabelledby: "join-title" }, [
        element("p", { className: "eyebrow" }, ["Exchange"]),
        element("h2", { id: "join-title" }, ["加入"]),
        element("p", {}, [
          "来交换友链吧！在交换友链之前，你的小站需要满足下面这些条件：",
        ]),
        element("ul", { className: "check-list" }, [
          createListItem("支持 HTTPS 协议，建议最低 TLS 版本为 v1.2。"),
          createListItem("内容不得违反中华人民共和国法律。"),
          createListItem("在中国大陆地区能够正常访问；国内服务器需要完成备案。"),
          createListItem("已经将本站添加到友链列表。"),
        ]),
        element("p", {}, [
          "如果你已经满足这些条件，可以在 ",
          createInlineLink(site.repository, "GitHub 仓库"),
          " 新开 Issue 或提交 Pull Request。",
        ]),
      ]),
      element("section", { className: "info-block", ariaLabelledby: "site-title" }, [
        element("p", { className: "eyebrow" }, ["About"]),
        element("h2", { id: "site-title" }, ["我的信息"]),
        element("dl", { className: "site-info" }, [
          createInfoRow("链接", createInlineLink(site.url, site.url)),
          createInfoRow("Gravatar Hash", element("code", {}, [site.gravatarHash])),
          createInfoRow("站点名称", site.name),
          createInfoRow("昵称", site.owner),
          createInfoRow("主题色", element("code", {}, [site.themeColor])),
          createInfoRow("描述", site.description),
        ]),
        element("p", { className: "muted" }, [
          "请尽量使用 Gravatar。没有其它特殊情况时，我不会移除友链；如果通过交换后移除了本站友链，我也会同步移除对应的小站。",
        ]),
      ]),
    ]),
  ]);
}

function createFooter() {
  const year = new Date().getFullYear();

  return element("footer", { className: "site-footer" }, [
    element("nav", { className: "footer-links", ariaLabel: "页脚链接" }, [
      createFooterLink(site.url, `© ${year} ${site.owner}`),
      createFooterLink(site.icp.moeicp.url, site.icp.moeicp.label, site.icp.moeicp.icon),
      createFooterLink(site.icp.miit.url, site.icp.miit.label),
    ]),
  ]);
}

function getFilteredFriends() {
  const query = state.query.trim().toLowerCase();

  if (!query) {
    return friends;
  }

  return friends.filter((friend) => {
    const searchable = [
      friend.name,
      friend.banner,
      ...friend.links.flatMap((link) => [link.name, link.link]),
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });
}

function createAvatar(src: string, alt: string, className: string) {
  const img = element("img", {
    alt,
    className,
    decoding: "async",
    loading: "lazy",
    referrerPolicy: "no-referrer",
    src,
  }) as HTMLImageElement;

  img.addEventListener(
    "error",
    () => {
      img.src = site.defaultAvatar;
    },
    { once: true },
  );

  return img;
}

function createButtonLink(href: string, text: string, variant: "primary" | "secondary") {
  return element("a", { className: `button-link button-link--${variant}`, href }, [text]);
}

function createPillLink(href: string, text: string) {
  return element("a", { className: "pill-link", href, target: "_blank" }, [text]);
}

function createInlineLink(href: string, text: string) {
  return element("a", { className: "inline-link", href, target: "_blank" }, [text]);
}

function createTextLink(href: string, text: string, external = false) {
  return element("a", { href, target: external ? "_blank" : undefined }, [text]);
}

function createFooterLink(href: string, text: string, icon?: string) {
  return element("a", { className: "footer-link", href, target: "_blank" }, [
    icon ? createFooterIcon(icon, `${text} 图标`) : null,
    element("span", {}, [text]),
  ]);
}

function createFooterIcon(src: string, alt: string) {
  return element("img", {
    alt,
    className: "footer-icon",
    decoding: "async",
    loading: "lazy",
    src,
  });
}

function createListItem(text: string) {
  return element("li", {}, [text]);
}

function createInfoRow(term: string, detail: Child) {
  return [
    element("dt", {}, [term]),
    element("dd", {}, [detail]),
  ];
}

function createEmptyState() {
  return element("div", { className: "empty-state" }, [
    element("strong", {}, ["没有找到匹配的小站"]),
    element("p", {}, ["换个关键词试试，或者清空搜索继续逛。"]),
  ]);
}

function getApp() {
  const mountElement = document.querySelector<HTMLDivElement>("#app");

  if (!mountElement) {
    throw new Error("Missing #app mount element.");
  }

  return mountElement;
}

function element<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: Partial<HTMLElementTagNameMap[K]> & {
    ariaHidden?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
    className?: string;
    href?: string;
    target?: string;
    type?: string;
  } = {},
  children: Child[] = [],
) {
  const node = document.createElement(tagName);

  Object.entries(options).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) {
      return;
    }

    if (key === "ariaHidden") {
      node.setAttribute("aria-hidden", String(value));
      return;
    }

    if (key === "ariaLabel") {
      node.setAttribute("aria-label", String(value));
      return;
    }

    if (key === "ariaLabelledby") {
      node.setAttribute("aria-labelledby", String(value));
      return;
    }

    if (key === "ariaLive") {
      node.setAttribute("aria-live", String(value));
      return;
    }

    if (key === "className") {
      node.className = String(value);
      return;
    }

    if (key in node) {
      (node as unknown as Record<string, unknown>)[key] = value;
      return;
    }

    node.setAttribute(key, String(value));
  });

  children.forEach((child) => appendChild(node, child));

  if (node instanceof HTMLAnchorElement && node.target === "_blank") {
    node.rel = "noreferrer";
  }

  return node;
}

function appendChild(parent: HTMLElement, child: Child) {
  if (child === null || child === undefined || child === false) {
    return;
  }

  if (Array.isArray(child)) {
    child.forEach((nestedChild) => appendChild(parent, nestedChild));
    return;
  }

  parent.append(child instanceof Node ? child : document.createTextNode(child));
}
