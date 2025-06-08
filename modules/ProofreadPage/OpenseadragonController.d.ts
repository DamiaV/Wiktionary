import { Viewer } from "openseadragon";

export default class OpenSeadragonController extends OO.EventEmitter {
  OpenSeadragon: typeof Viewer;
  viewer: Viewer;
  noImageFound: boolean;
  img: HTMLImageElement | null;
  zoomFactor: number;
  animationTime: number;
  usebetatoolbar: boolean;
  lastId: string;

  /**
   * Construct an OpenSeadragon legacy-image-pyramid tile source from the
   * image element on the page
   *
   * @return OSD tile source constructor options
   */
  constructImagePyramidSource(): {
    type: "legacy-image-pyramid";
    levels: {
      url: string;
      width: number;
      height: number;
    }[];
  } | undefined;

  /**
   * Initialize the zoom system
   */
  initialize(id: string): void;

  /**
   * Force Openseadragon to initialize. This function can be used to trigger
   * Openseadragon updates after registering callbacks that modify specific
   * parameters.
   */
  forceInitialize(): void;

  /**
   * Returns a URL to the current image source
   *
   * @return url to the image
   */
  getCurrentImage(): string;

  /**
   * Initializes viewport from previously saved data
   *
   * @private
   * @param id Current image orientation
   */
  initializeViewportFromSavedData(id: string): void;

  /**
   * Get Storage key for particular Page: page
   * We are going to use the following format
   * mw-prp-page-edit-<name_of_associated_index_page>-<id>
   * where id denotes vertical/horizontal
   *
   * @private
   * @param id
   * @return Storage key for given Page: page
   */
  getStorageKey(id: string): string;
}
