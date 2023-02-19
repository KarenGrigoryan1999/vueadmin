import Badge from "../components/Badge";
import BaseAlert from "../components/BaseAlert";
import BaseButton from "../components/BaseButton";
import BaseCheckbox from "../components/BaseCheckbox";
import BaseDropdown from "../components/BaseDropdown";
import BaseHeader from "../components/BaseHeader";
import BaseInput from "../components/BaseInput";
import BaseNav from "../components/BaseNav";
import BasePagination from "../components/BasePagination";
import BaseProgress from "../components/BaseProgress";
import BaseSwitch from "../components/BaseSwitch";
import BaseRadio from "../components/BaseRadio";
import BaseTable from "../components/BaseTable";
import Card from "../components/Card";
import Modal from "../components/Modal";
import StatsCard from "../components/StatsCard";
import TabPane from "../components/Tabs/TabPane";
import Tabs from "../components/Tabs/Tabs";
import FilesUploader from "../components/files-uploader/files-uploader";

import { ElPopover, ElTooltip } from "element-plus";

const GlobalComponents = {
  install(app) {
    app.mixin({
      methods: {
        pathToServer(photo) {
          if(photo?.is_private) {
            return `${process.env.VUE_APP_API_LOCAL_URL}/files/${photo.name}`
          }
          if (photo?.name !== undefined) {
            return `${process.env.VUE_APP_API_LOCAL_URL}/${photo.catalog}/${photo.name}`;
          }
          return "@/assets/no-avatar.png";
        }
      }
    });
    app.component("badge", Badge);
    app.component("base-alert", BaseAlert);
    app.component("base-button", BaseButton);
    app.component("base-checkbox", BaseCheckbox);
    app.component("base-dropdown", BaseDropdown);
    app.component("base-header", BaseHeader);
    app.component("base-input", BaseInput);
    app.component("base-nav", BaseNav);
    app.component("base-pagination", BasePagination);
    app.component("base-progress", BaseProgress);
    app.component("base-switch", BaseSwitch);
    app.component("base-radio", BaseRadio);
    app.component("base-table", BaseTable);
    app.component("card", Card);
    app.component("modal", Modal);
    app.component("stats-card", StatsCard);
    app.component("tab-pane", TabPane);
    app.component("tabs", Tabs);
    app.component("files-uploader", FilesUploader);
    app.use(ElTooltip);
    app.use(ElPopover);
  }
};

export default GlobalComponents;
