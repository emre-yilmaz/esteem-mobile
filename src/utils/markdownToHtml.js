import Remarkable from 'remarkable';
// TODO: Refactoring need!
const md = new Remarkable({ html: true, breaks: true, linkify: true });

const imgCenterRegex = /([<center>]http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|PNG|GIF|JPG)[</center>]/g;
const onlyImageLinkRegex = /([\n]http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|PNG|GIF|JPG)/g;
const onlyImageDoubleLinkRegex = /(\nhttps)(.*)(?=jpg|gif|png|PNG|GIF|JPG|)/g;
const postRegex = /^https?:\/\/(.*)\/(.*)\/(@[\w.\d-]+)\/(.*)/i;
const copiedPostRegex = /\/(.*)\/(@[\w.\d-]+)\/(.*)/i;
const youTubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g;
const vimeoRegex = /(https?:\/\/)?(www\.)?(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
const dTubeRegex = /(https?:\/\/d.tube.#!\/v\/)(\w+)\/(\w+)/g;
const authorNameRegex = /(^|[^a-zA-Z0-9_!#$%&*@＠\/]|(^|[^a-zA-Z0-9_+~.-\/]))[@＠]([a-z][-\.a-z\d]+[a-z\d])/gi;
const tagsRegex = /(^|\s|>)(#[-a-z\d]+)/gi;
const centerRegex = /(<center>)/g;
const imgRegex = /(https?:\/\/.*\.(?:tiff?|jpe?g|gif|png|svg|ico|PNG|GIF|JPG))/g;
const pullRightLeftRegex = /(<div class="[^"]*?pull-[^"]*?">(.*?)(<[/]div>))/g;
const linkRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
const markdownImageRegex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g;
const urlRegex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gm;
const aTagRegex = /(<\s*a[^>]*>(.*?)<\s*[/]\s*a>)/g;
const imgTagRegex = /(<img[^>]*>)/g;
const iframeRegex = /(?:<iframe[^>]*)(?:(?:\/>)|(?:>.*?<\/iframe>))/g;
//const codeTagRegex= /(?:<code[^>]*)(?:(?:\/>)|(?:>.*?<\/code>))/g;

export const markDown2Html = (input) => {
  if (!input) {
    return '';
  }
  let output = input;

  if (authorNameRegex.test(output)) {
    output = replaceAuthorNames(output);
  }

  if (tagsRegex.test(output)) {
    output = replaceTags(output);
  }

  if (youTubeRegex.test(output)) {
    output = createYoutubeIframe(output);
  }

  if (imgTagRegex.test(output)) {
    output = handleImageTag(output);
  }

  if (vimeoRegex.test(output)) {
    output = createVimeoIframe(output);
  }

  if (vimeoRegex.test(output)) {
    output = createVimeoIframe(output);
  }

  if (centerRegex.test(output)) {
    output = centerStyling(output);
  }

  if (postRegex.test(output)) {
    output = steemitUrlHandle(output);
  }

  if (markdownImageRegex.test(output)) {
    output = changeMarkdownImage(output);
  }

  if (iframeRegex.test(output)) {
    output = handleIframe(output);
  }

  // if (codeTagRegex.test(output)) {
  //   output = handleCodeTag(output);
  // }

  if (linkRegex.test(output)) {
    output = handleLinks(output);
  }

  if (aTagRegex.test(output)) {
    output = handleATag(output);
  }

  output = md.render(output);

  return output;
};

const replaceAuthorNames = input => input.replace(authorNameRegex, (match, preceeding1, preceeding2, user) => {
  const userLower = user.toLowerCase();
  const preceedings = (preceeding1 || '') + (preceeding2 || '');
  return `${preceedings}<a class="markdown-author-link" href="${userLower}" data-author="${userLower}">@${user}</a>`;
});

const replaceTags = input => input.replace(tagsRegex, (tag) => {
  if (/#[\d]+$/.test(tag)) return tag;
  const preceding = /^\s|>/.test(tag) ? tag[0] : '';
  tag = tag.replace('>', '');
  const tag2 = tag.trim().substring(1);
  const tagLower = tag2.toLowerCase();
  return `${preceding}<a class="markdown-tag-link" href="${tagLower}" data-tag="${tagLower}">${tag.trim()}</a>`;
});

const handleATag = input => input.replace(aTagRegex, (link) => {
  if (dTubeRegex.test(link)) {
    const dTubeMatch = link.match(dTubeRegex)[0];
    const execLink = dTubeRegex.exec(dTubeMatch);

    if (execLink[2] && execLink[3]) {
      const embedLink = `https://emb.d.tube/#!/${execLink[2]}/${execLink[3]}`;

      return iframeBody(embedLink);
    }
    if (dTubeMatch) {
      return iframeBody(dTubeMatch);
    }
    return link;
  }

  if (imgRegex.test(link)) {
    const imgMatch = link.match(imgRegex)[0];

    if (imgMatch) return `<a src="${imgMatch}">Image</a>`;
  }

  return link;
});

const handleLinks = input => input.replace(linkRegex, (link) => {
  if (link) {
    if (
      link
        .toLowerCase()
        .trim()
        .indexOf('https://steemitimages.com/0x0/') === 0
        || imgRegex.test(link)
    ) {
      const imageMatch = link.match(imgRegex);

      if (imageMatch && imageMatch[0]) {
        return imageBody(imageMatch[0]);
      }
    }
  }

  return link;
});

const changeMarkdownImage = input => input.replace(markdownImageRegex, (link) => {
  const markdownMatch = link.match(markdownImageRegex);
  if (markdownMatch[0]) {
    const firstMarkdownMatch = markdownMatch[0];
    const _link = firstMarkdownMatch.match(urlRegex)[0];

    return _link;
  }
  return link;
});

const centerStyling = input => input.replace(centerRegex, () => '<center style="text-align:center;">');

// const handleCodeTag = input => input.replace(codeTagRegex, (tag) => {
//   const stringsRegex = /(?<=>)(.*)(?=<)/g;
//   const match = tag.match(stringsRegex);

//   if (match && match[0]) {
//     return `<p class="code" >${match[0]}</p>`;
//   }

//   return iframeBody(match[0]);

// });

const createCenterImage = input => input.replace(imgCenterRegex, (link) => {
  let _link = link;

  _link = _link.split('>')[1];
  _link = _link.split('<')[0];
  return `><img data-href="${`https://steemitimages.com/600x0/${_link}`}" src="${`https://steemitimages.com/600x0/${_link}`}"><`;
});

const changePullRightLeft = input => input.replace(pullRightLeftRegex, (item) => {
  const imageLink = item.match(linkRegex)[0];

  return `<center style="text-align:center;"><img src="${`https://steemitimages.com/600x0/${imageLink}`}"/></center><br>`;
});

const steemitUrlHandle = input => input.replace(postRegex, (link) => {
  const postMatch = link.match(postRegex);
  const tag = postMatch[2];
  const author = postMatch[3].replace('@', '');
  const permlink = postMatch[4];

  return `<a class="markdown-post-link" href="${permlink}" data_tag={${tag}} data_author="${author}">/${permlink}</a>`;
});

const createImage = input => input.replace(onlyImageLinkRegex, link => imageBody(link));

const handleImageTag = input => input.replace(imgTagRegex, (imgTag) => {
  const _imgTag = imgTag.trim();
  const match = _imgTag.match(imgRegex);

  if (match && match[0]) {
    return match[0];
  }

  return imgTag;
});

const createFromDoubleImageLink = input => input.replace(onlyImageDoubleLinkRegex, (link) => {
  const _link = link.trim();

  return imageBody(_link);
});

const createYoutubeIframe = input => input.replace(youTubeRegex, (link) => {
  const execVideo = youTubeRegex.exec(link);
  const match = link.match(youTubeRegex);

  if (execVideo[1] && match) {
    const videoLink = execVideo[1];
    const embedLink = `https://www.youtube.com/embed/${videoLink}`;

    return iframeBody(embedLink);
  }

  return link;
});

const handleIframe = input => input.replace(iframeRegex, (link) => {
  const match = link.match(linkRegex);

  if (match && match[0]) {
    return iframeBody(match[0]);
  }

  return link;
});

const createDtubeIframe = input => input.replace(dTubeRegex, (link) => {
  const execLink = dTubeRegex.exec(link);
  const dTubeMatch = link.match(dTubeRegex)[0];

  if (execLink[2] && execLink[3]) {
    const embedLink = `https://emb.d.tube/#!/${execLink[2]}/${execLink[3]}`;

    return iframeBody(embedLink);
  }
  if (dTubeMatch) {
    return iframeBody(dTubeMatch);
  }
  return link;
});

const createVimeoIframe = input => input.replace(vimeoRegex, (link) => {
  const execLink = vimeoRegex.exec(link);

  const embedLink = `https://player.vimeo.com/video/${execLink[3]}`;

  return iframeBody(embedLink);
});

const iframeBody = link => `<iframe frameborder='0' allowfullscreen src='${link}'></iframe>`;
const imageBody = link => `<img src="${`https://steemitimages.com/600x0/${link}`}">`;
