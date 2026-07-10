import { getTeamProjectTreeListService } from "@/sevices/user";
import { useUserConfig } from "@/store";
import { isArray } from "lodash";

/**
 * Fetch team project list
 */
export const fetchTeamProjectList = async () => {
  const { updateTeamProjectList } = useUserConfig.getState();
  try {
    const res = await getTeamProjectTreeListService();
    if(isArray(res) && res.length > 0){
      updateTeamProjectList(res);
    }
   
  } catch (error) {}
};
