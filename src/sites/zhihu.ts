import { IProvider } from "../provider";
import { matchLinkFromUrl, antiRedirect } from "../utils";

export class ZhihuProvider implements IProvider {
  public test = /zhihu\.com\/\?target=(.*)/;
  public resolve(aElement: HTMLAnchorElement) {
    antiRedirect(aElement, matchLinkFromUrl(aElement, this.test));
  }
}
