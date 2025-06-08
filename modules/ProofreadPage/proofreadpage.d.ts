import { Viewer } from "openseadragon";
import PageQualityInputWidget from "./PageQualityInputWidget";
import OpenSeadragonController from "./OpenseadragonController";

declare global {
  namespace mw {
    namespace proofreadpage {
      const openseadragon: OpenSeadragonController;

      /**
       * @deprecated Please use new API. [Since November 2022]
       */
      const viewer: Viewer;

      /**
       * @internal not stable for use.
       */
      const PageQualityInputWidget: PageQualityInputWidget;
    }
  }
}
