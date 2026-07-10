import { useTranslation } from 'react-i18next';

import { Dropdown } from 'antd';

import { some } from 'lodash';

import CautionSvg from './icons/caution.svg?react';
import ClassSvg from './icons/class.svg?react';
import DangerSvg from './icons/danger.svg?react';
import DetailSvg from './icons/detail.svg?react';
import ErSvg from './icons/er.svg?react';
import FlowchartSvg from './icons/flowchart.svg?react';
import GanttSvg from './icons/gantt.svg?react';
import HighlightBlue from './icons/highlight_blue.svg?react';
import HighlightGray from './icons/highlight_gray.svg?react';
import HighlightGreen from './icons/highlight_green.svg?react';
import HighlightOrange from './icons/highlight_orange.svg?react';
import HighLightPurple from './icons/highlight_purple.svg?react';
import HighLightRed from './icons/highlight_red.svg?react';
import HighlightYellow from './icons/highlight_yellow.svg?react';
import InfoSvg from './icons/info.svg?react';
import NoteSvg from './icons/note.svg?react';
import PieSvg from './icons/pie.svg?react';
import SequenceSvg from './icons/sequence.svg?react';
import StateSvg from './icons/state.svg?react';
import TipSvg from './icons/tip.svg?react';
import UjSvg from './icons/uj.svg?react';

import { DropDownWrap } from './style';

function Insert(props: any) {
  const { t } = useTranslation();
  const { editor, appendBlock, codemirror } = props;

  const clickHighlightHandle = (param: any) => {
    const { line } = appendBlock(`:::highlight ${param?.key} 💡\n\r:::\n`);
    editor.setSelection(codemirror.Pos(line + 1, 0), codemirror.Pos(line + 2, 0));
    editor.focus();
  };
  const clickAdmHandle = (param: any) => {
    const { line } = appendBlock(`:::${param?.key}\n\r:::\n`);
    editor.setSelection(codemirror.Pos(line + 1, 0), codemirror.Pos(line + 2, 0));
    editor.focus();
  };
  const clickMermaidHandle = (param: any) => {
    const { line } = appendBlock(`\`\`\`mermaid\n${param.code}\n\`\`\``);
    editor.setSelection(
      codemirror.Pos(line + 1, 0),
      codemirror.Pos(line + param.code.split('\n').length)
    );
    editor.focus();
  };
  const highlightArr = [
    { key: 'purple', label: t('supplement.purple'), icon: <HighLightPurple /> },
    { key: 'yellow', label: t('supplement.yellow'), icon: <HighlightYellow /> },
    { key: 'orange', label: t('supplement.orange'), icon: <HighlightOrange /> },
    { key: 'red', label: t('supplement.red'), icon: <HighLightRed /> },
    { key: 'blue', label: t('supplement.blue'), icon: <HighlightBlue /> },
    { key: 'green', label: t('supplement.green'), icon: <HighlightGreen /> },
    { key: 'gray', label: t('supplement.gray'), icon: <HighlightGray /> },
  ];
  const AdmArr = [
    { key: 'note', label: t('supplement.nt'), icon: <NoteSvg /> },
    { key: 'tip', label: t('supplement.tp'), icon: <TipSvg /> },
    { key: 'info', label: t('supplement.info'), icon: <InfoSvg /> },
    { key: 'caution', label: t('supplement.caution'), icon: <CautionSvg /> },
    { key: 'danger', label: t('supplement.danger'), icon: <DangerSvg /> },
  ];
  const MermaidArr = [
    {
      key: 'flowchart',
      icon: <FlowchartSvg />,
      label: t('supplement.flowchart'),
      code: `graph TD
    Start --> Stop`,
    },
    {
      key: 'sequence',
      icon: <SequenceSvg />,
      label: t('supplement.sequence'),
      code: `sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!`,
    },
    {
      key: 'class',
      icon: <ClassSvg />,
      label: t('supplement.class'),
      code: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
    +String beakColor
    +swim()
    +quack()
    }
    class Fish{
    -int sizeInFeet
    -canEat()
    }
    class Zebra{
    +bool is_wild
    +run()
    }`,
    },
    {
      key: 'state',
      icon: <StateSvg />,
      label: t('supplement.state'),
      code: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
  
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
    },
    {
      key: 'er',
      icon: <ErSvg />,
      label: t('supplement.er'),
      code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
    },
    {
      key: 'uj',
      icon: <UjSvg />,
      label: t('supplement.uj'),
      code: `journey
    title My working day
    section Go to work
    Make tea: 5: Me
    Go upstairs: 3: Me
    Do work: 1: Me, Cat
    section Go home
    Go downstairs: 5: Me
    Sit down: 5: Me`,
    },
    {
      key: 'gantt',
      icon: <GanttSvg />,
      label: t('supplement.gantt'),
      code: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d`,
    },
    {
      key: 'pie',
      icon: <PieSvg />,
      label: t('supplement.pie'),
      code: `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`,
    },
  ];
  return (
    <DropDownWrap>
      <Dropdown
        overlayStyle={{ width: 200 }}
        placement="bottom"
        menu={{
          rootClassName: 'md-drop-menu',
          items: [
            {
              key: 'layout',
              type: 'group',
              label: t('supplement.layout'),
              children: [
                {
                  key: 'highlight',
                  label: (
                    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <HighlightOrange />
                      <span style={{ marginLeft: 12 }}>{t('supplement.highlight')}</span>
                    </div>
                  ),
                  children: highlightArr,
                },
                {
                  key: 'notice',
                  label: (
                    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <NoteSvg />
                      <span style={{ marginLeft: 12 }}>{t('supplement.notice')}</span>
                    </div>
                  ),
                  children: AdmArr,
                },
                {
                  key: 'details',
                  label: (
                    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <DetailSvg />
                      <span style={{ marginLeft: 12 }}>{t('supplement.collapse')}</span>
                    </div>
                  ),
                },
              ],
            },
            {
              key: 'other',
              type: 'group',
              label: t('supplement.other'),
              children: [
                {
                  key: 'mermaid',
                  label: (
                    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <FlowchartSvg />
                      <span style={{ marginLeft: 12 }}>{t('supplement.mermaid')}</span>
                    </div>
                  ),
                  children: MermaidArr,
                },
              ],
            },
          ],
          onClick: ({ item, key, domEvent }: any) => {
            domEvent?.stopPropagation();
            if (key === 'details') {
              const code = `<details>\n  <summary>${t('supplement.click')}</summary>\n  ${t(
                'supplement.this_detail'
              )}\n</details>`;
              const { line } = appendBlock(code);
              editor.setSelection(
                codemirror.Pos(line + 1, 0),
                codemirror.Pos(line + code.split('\n').length)
              );
              editor.focus();
            }
            if (some(highlightArr, ['key', key])) {
              clickHighlightHandle({ key });
            }
            if (some(AdmArr, ['key', key])) {
              clickAdmHandle({ key });
            }
            if (some(MermaidArr, ['key', key])) {
              clickMermaidHandle(item.props);
            }
          },
        }}
      >
        <div
          className="markdown-insert-icon"
          style={{
            color: '#FA7600',
            display: 'flex',
            alignItems: 'center',
            lineHeight: 1,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6Z"
              fill="#FA7600"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.57143 5.57143V3H6.42857V5.57143H9V6.42857H6.42857V9H5.57143V6.42857H3V5.57143H5.57143Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.57143 5.57143V3H6.42857V5.57143H9V6.42857H6.42857V9H5.57143V6.42857H3V5.57143H5.57143Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.57143 5.57143V3H6.42857V5.57143H9V6.42857H6.42857V9H5.57143V6.42857H3V5.57143H5.57143Z"
              fill="white"
            />
          </svg>
          &nbsp;{t('supplement.insert')}
        </div>
      </Dropdown>
    </DropDownWrap>
  );
}

export default Insert;
