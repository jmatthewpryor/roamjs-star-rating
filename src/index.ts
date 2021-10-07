import { addStyle, toConfig, runExtension, createButtonObserver, getUidsFromButton, getTreeByBlockUid, getTreeByPageName } from "roam-client";
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
}

.roam-star-rating-star-active {
    fill: yellow
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
      let tree = getTreeByBlockUid(blockUid);
      let valueBlockUid = null;
      let initialValue = 1;
      let initialValueNode = tree.children.find(
        (c) => !isNaN(parseInt(c.text))
      );
      if (!initialValueNode) {
        valueBlockUid = window.roamAlphaAPI.util.generateUID();
        window.roamAlphaAPI.createBlock({
          location: { "parent-uid": blockUid, order: 0 },
          block: { string: initialValue.toString() , uid: valueBlockUid},
        });
      }
      else {
        valueBlockUid = initialValueNode.uid;
        initialValue = initialValueNode
        ? parseInt(initialValueNode.text)
        : 0;
      }

      const configTree = getTreeByPageName(CONFIG);
      const ratingTree = configTree.find((t) => /rating/i.test(t.text));
    
      const maxSetting = ratingTree?.children
        ?.find?.((t) => /maximum/i.test(t.text))
        ?.children?.[0]?.text?.trim?.();

      const template = ratingTree?.children
      ?.find?.((t) => /template/i.test(t.text))
      ?.children?.[0]?.text?.trim?.();

      renderStartRating(initialValue, Number.parseInt(maxSetting), valueBlockUid, template, b.parentElement);
    },
  });

});
