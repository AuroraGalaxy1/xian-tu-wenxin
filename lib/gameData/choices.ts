// 选择事件数据
import { ChoiceOption } from '@/types/scene';

export interface ChoiceEvent {
  id: string;
  title: string;
  description: string;
  options: ChoiceOption[];
}

export const choicesData: Record<string, ChoiceEvent> = {
  fei_zhai_zhinian: {
    id: 'fei_zhai_zhinian',
    title: '废宅中的执念回响',
    description:
      '你站在废宅正堂，残破的供桌前散落着几页发黄的纸笺。上面字迹潦草，依稀可见反复写着一句话：\n\n"若我当初再强一些，她就不会……"\n\n字迹到此中断，纸上只有一道深深的墨痕，像是笔尖在纸上停留了很久很久。\n\n一阵阴风穿堂而过，你仿佛听到一声叹息——那是废宅修士百年未散的执念。\n\n面对这位陨落前辈的遗恨，你心中涌起千般思绪……',
    options: [
      {
        label: '"我绝不会重蹈覆辙"',
        description: '紧握双拳，立下誓言。他人的悲剧将成为你的警钟，但也让你心中多了一份执念。',
        effects: { zhinian: 10, daoxin: 5 },
        logMessage: '你立下誓言，绝不重蹈覆辙。道心微震，但执念也更深了一分。',
      },
      {
        label: '"修行之路，本就有死无生"',
        description: '长叹一声，将悲悯化作前行的动力。你深知修行路上白骨累累，唯有道心坚定者方能走远。',
        effects: { daoxin: 10, lingyun: 5 },
        logMessage: '你心有所悟，道心愈发坚定，灵蕴也随之增长。',
      },
      {
        label: '沉默不语',
        description: '默默将纸笺放回原处，转身离去。有些事，说与不说都是错。不如将这份体悟深藏于心。',
        effects: { zhinian: -5, yinguo: 5 },
        logMessage: '你选择了沉默。执念似乎淡了一些，但因果之线悄然缠绕。',
      },
    ],
  },
};