/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";

//
// from https://andrewgbliss.medium.com/
// https://javascript.plainenglish.io/how-to-build-a-star-rating-component-in-react-dad06b05679b
//
function StarIcon({
    className,
  }: {
    className: string;
  }) {
    return (
      <svg width="100%" height="100%" className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
    );
  }
  
  function RatingIcon({
    index,
    rating,
    hoverRating,
    onMouseEnter,
    onMouseLeave,
    onSaveRating,
  }:
  {
    index: number;
    rating: number;
    hoverRating: number
    onMouseEnter: any;
    onMouseLeave: any;
    onSaveRating: any;
  }) {
    const className = useMemo(() => {
      if (hoverRating >= index) {
        return 'roam-star-rating-star roam-star-rating-star-active';
      } else if (!hoverRating && rating >= index) {
        return 'roam-star-rating-star roam-star-rating-star-active';
      }
      return 'roam-star-rating-star';
    }, [rating, hoverRating, index]);
    return (
        <div 
          className="roam-star-rating-star"
          onMouseEnter={() => onMouseEnter(index)} 
          onMouseLeave={() => onMouseLeave()} 
          onClick={() => onSaveRating(index)}>
          <StarIcon className={className} />
        </div>
    )
  }
  
  // They don't necessarily need to take props
  // This one also has an explicit return
  const StarRating = ({
    initialValue,
    maximumStars,
    blockUid,
    smartBlockTemplate
  }: {
    initialValue: number;
    maximumStars: number;
    blockUid: string;
    smartBlockTemplate: string;
  }) : JSX.Element => {
    const [rating, setRating] = useState(initialValue);
    const [hoverRating, setHoverRating] = useState(initialValue);
    const onMouseEnter = (index: number) => {
      setHoverRating(index);
    };
    const onMouseLeave = () => {
      setHoverRating(0);
    };
    const onSaveRating = (index: number) => {
      setRating(index);
      window.roamAlphaAPI.updateBlock({
        block: { uid: blockUid, string: index.toString() },
      });
      console.log(`StarRating: blockUid ${blockUid} smartBlockTemplate ${smartBlockTemplate}`)
      if( smartBlockTemplate ) { 
        const valueBlockUid: string = window.roamAlphaAPI.util.generateUID();
        window.roamAlphaAPI.createBlock({
          location: { "parent-uid": blockUid, order: 1000 /* at end */ },
          block: { string: '' , uid: valueBlockUid},
        });
        window.roamjs.extension.smartblocks.triggerSmartblock({
          srcName: smartBlockTemplate,
          targetUid: valueBlockUid,
          variables: {
            'rating': index.toString(),
            'wow': 'Wee'
          }
        })
      };
    };
    return(
      <div className="roam-star-rating">
        {Array.from(Array(maximumStars).keys()).map((index) => {
          return (
            <RatingIcon 
              key={index+1} 
              index={index+1} 
              rating={rating} 
              hoverRating={hoverRating} 
              onMouseEnter={onMouseEnter} 
              onMouseLeave={onMouseLeave} 
              onSaveRating={onSaveRating} />
          )
        })}
      </div>
    );
  }

export const DemoTallyCounter = (): JSX.Element => (
  <StarRating maximumStars={5} blockUid={''} initialValue={0} smartBlockTemplate={null}/>
);
export const renderStartRating = (
  initialValue: number,
  maximumStars: number,
  blockUid: string,
  smartBlockTemplate: string,
  p: HTMLElement
): void => {
    ReactDOM.render(<StarRating maximumStars={maximumStars} blockUid={blockUid} initialValue={initialValue} smartBlockTemplate={smartBlockTemplate}/>, p);
}

export default StarRating;
