import { DRAW_TOOLS } from 'components/tools/tools.constants';

const isDrawTool = (toolId) => DRAW_TOOLS.includes(toolId);

export default isDrawTool;
