import { addStyle, toConfig, runExtension, createButtonObserver, getUidsFromButton, getTreeByBlockUid, getTextByBlockUid, getTreeByPageName, TreeNode } from "roam-client";
import { createConfigObserver } from "roamjs-components";
import { renderStartRating } from "./StarRating";

addStyle(`
.roam-star-rating {
  display: flex;
}

.roam-star-rating-star {
  cursor: pointer;
  width: 2em;
  height: 2em;
  fill: none;
  stroke: black;
  strokeWidth: 0.5px
}

.roam-star-rating-star-active {
  fill: yellow
}
.roam-star-rating-label {
  align-self: center
}

`);

const ID = "star-rating";
const CONFIG = toConfig(ID);
runExtension(ID, () => {

  createConfigObserver({
    title: CONFIG,
    config: {
      tabs: [
        {
          id: "rating",
          fields: [
            {
              type: "number",
              title: "maximum",
              description:
                "The maximum stars in a rating",
              defaultValue: 5,
            },
            {
              type: "text",
              title: "template",
              description:
                "The template to run after a rating",
            },
          ],
        },
      ],
    },
  });

  createButtonObserver({
    shortcut: "star-rating",
    attribute: "rating-button",
    render: (b: HTMLButtonElement) => {
      const { blockUid } = getUidsFromButton(b);
      let label: string = undefined;
      let attribute: string = undefined;
      let tree = getTreeByBlockUid(blockUid);
      let valueBlockUid: string = undefined;
      let template: string = undefined;

      // get params from button block
      if (blockUid && tree.text) {
        const parts = tree.text.replace("{{","").replace("}}","").split(":");
        if (parts.length > 1) {
          label = parts[1];
          if (parts.length > 2) {
            attribute = parts[2];
          }
        }
      }

      const updateRating = (index: number) => {
        window.roamAlphaAPI.updateBlock({
          block: { uid: valueBlockUid, string: attribute?.length > 0 ? `${attribute}::${index.toString()}` : index.toString() },
        });
        if( template ) { 
          let newBlockUid = window.roamAlphaAPI.util.generateUID();
          window.roamAlphaAPI.createBlock({
            location: { "parent-uid": valueBlockUid, order: 1000 /* at end */ },
            block: { string: '' , uid: newBlockUid},
          });
          window.roamjs.extension.smartblocks.triggerSmartblock({
            srcName: template,
            targetUid: newBlockUid,
            variables: {
              'rating': index.toString(),
              'label': label,
              'attribute': attribute,
            }
          })
        };
      }

      const getRatingValue = () => {
        let initialValue: number = 0;
        let valueBlocktext = getTextByBlockUid(valueBlockUid);
        console.log(`STAR RATING value block text: ${valueBlocktext}`);
        if (valueBlocktext?.length > 0) {
          const regex = new RegExp(
            `(\\w+)::(\\d+)`,
            "g"
          );
      
          const iter = valueBlocktext.matchAll(regex);
          let matchAll = Array.from(iter);
          if (matchAll.length > 0) {
            initialValue = parseInt(matchAll[0][2]);
          }
          else if (valueBlocktext.match(/^\d+$/)) {
            initialValue = parseInt(valueBlocktext);
          }
        }
        return initialValue;
      }

      if (!tree.children.length) {
        valueBlockUid = window.roamAlphaAPI.util.generateUID();
        window.roamAlphaAPI.createBlock({
          location: { "parent-uid": blockUid, order: 0 },
          block: { string: "" , uid: valueBlockUid},
        });
        updateRating(0);
      }
      else {
        valueBlockUid = tree.children[0].uid;
      }

      let initialValue = getRatingValue();

      const configTree = getTreeByPageName(CONFIG);
      const ratingTree = configTree.find((t) => /rating/i.test(t.text));
    
      const maxSetting = ratingTree?.children
        ?.find?.((t) => /maximum/i.test(t.text))
        ?.children?.[0]?.text?.trim?.();

      template = ratingTree?.children
      ?.find?.((t) => /template/i.test(t.text))
      ?.children?.[0]?.text?.trim?.();
      
      renderStartRating(initialValue, Number.parseInt(maxSetting), label, updateRating, b.parentElement);
    },
  });

});


