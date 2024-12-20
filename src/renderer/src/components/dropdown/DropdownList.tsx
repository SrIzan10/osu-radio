import List from "../list/List";
import { Props as ListProps } from "../list/List";
import Popover from "../popover/Popover";
import { ParentComponent } from "solid-js";
import { Portal } from "solid-js/web";

const DropdownList: ParentComponent<ListProps> = (props) => {
  return (
    <Portal>
      <Popover.Overlay />
      <Popover.Content class="flex w-fit min-w-48 flex-col gap-1 rounded-xl border border-stroke bg-thick-material p-3 backdrop-blur-md">
        <List {...props} />
      </Popover.Content>
    </Portal>
  );
};

export default DropdownList;
