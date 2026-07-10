import { useSafeState } from "ahooks";

import IconFont from "@/components/ui/IconFont";
import CustomPopover from "@/components/ui/Popover";

import DropContent from "./DropContent";

import { AiWrap } from "./style";

interface Props {
  onChange?: (val: string) => void;
  filterKey?: string;
}
const AiDescription = (props: Props) => {
  const { onChange, filterKey } = props || {};

  const [open, setOpen] = useSafeState(false);
  const handleSelect = () => {
    setOpen(false);
  };

  return (
    <>
      <CustomPopover
        trigger={"click"}
        open={open}
        onOpenChange={(open: boolean) => setOpen(open)}
        placement="bottomRight"
        overlayInnerStyle={{ padding: "8px 0" }}
        content={
          <>
            <div className="params-desc-wrapper" style={{ padding: "4px 8px" }}>
              <DropContent
                handleSelect={handleSelect}
                onChange={(val: string) => onChange?.(val)}
                filterKey={filterKey}
              />
            </div>
          </>
        }
        style={{ zIndex: 1050 }}
      >
        <AiWrap>
          <IconFont
            className="ai-icon"
            onClick={() => setOpen(true)}
            type="icon-parameter-lib-change"
          />
        </AiWrap>
      </CustomPopover>
    </>
  );
};

export default AiDescription;
