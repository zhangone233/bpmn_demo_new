// @ts-nocheck

import { is } from '../common/ModelUtil';

import { getParent } from './ModelingUtil';

import { asTRBL } from 'diagram-js/lib/layout/LayoutUtil';

import { substractTRBL, resizeTRBL } from 'diagram-js/lib/features/resize/ResizeUtil';

const { abs } = Math;

function getTRBLResize(oldBounds, newBounds) {
  return substractTRBL(asTRBL(newBounds), asTRBL(oldBounds));
}

const LANE_PARENTS = ['bpmn:Participant', 'bpmn:Process', 'bpmn:SubProcess'];

export var LANE_INDENTATION = 30;

/**
 * Collect all lane shapes in the given paren
 *
 * @param  {djs.model.Shape} shape
 * @param  {Array<djs.model.Base>} [collectedShapes]
 *
 * @return {Array<djs.model.Base>}
 */
export function collectLanes(shape, collectedShapes) {
  collectedShapes = collectedShapes || [];

  shape.children.filter(function (s) {
    if (is(s, 'bpmn:Lane')) {
      collectLanes(s, collectedShapes);

      collectedShapes.push(s);
    }
  });

  return collectedShapes;
}

/**
 * Return the lane children of the given element.
 *
 * @param {djs.model.Shape} shape
 *
 * @return {Array<djs.model.Shape>}
 */
export function getChildLanes(shape) {
  return shape.children.filter(function (c) {
    return is(c, 'bpmn:Lane');
  });
}

/**
 * Return the root element containing the given lane shape
 *
 * @param {djs.model.Shape} shape
 *
 * @return {djs.model.Shape}
 */
export function getLanesRoot(shape) {
  return getParent(shape, LANE_PARENTS) || shape;
}

/**
 * Compute the required resize operations for lanes
 * adjacent to the given shape, assuming it will be
 * resized to the given new bounds.
 *
 * @param {djs.model.Shape} shape
 * @param {Bounds} newBounds
 *
 * @return {Array<Object>}
 */
export function computeLanesResize(shape, newBounds) {
  const rootElement = getLanesRoot(shape);

  const initialShapes = is(rootElement, 'bpmn:Process') ? [] : [rootElement];

  const allLanes = collectLanes(rootElement, initialShapes);
  const shapeTrbl = asTRBL(shape);
  const shapeNewTrbl = asTRBL(newBounds);
  const trblResize = getTRBLResize(shape, newBounds);
  const resizeNeeded = [];

  allLanes.forEach(function (other) {
    if (other === shape) {
      return;
    }

    let topResize = 0;
    const rightResize = trblResize.right;
    let bottomResize = 0;
    const leftResize = trblResize.left;

    const otherTrbl = asTRBL(other);

    if (trblResize.top) {
      if (abs(otherTrbl.bottom - shapeTrbl.top) < 10) {
        bottomResize = shapeNewTrbl.top - otherTrbl.bottom;
      }

      if (abs(otherTrbl.top - shapeTrbl.top) < 5) {
        topResize = shapeNewTrbl.top - otherTrbl.top;
      }
    }

    if (trblResize.bottom) {
      if (abs(otherTrbl.top - shapeTrbl.bottom) < 10) {
        topResize = shapeNewTrbl.bottom - otherTrbl.top;
      }

      if (abs(otherTrbl.bottom - shapeTrbl.bottom) < 5) {
        bottomResize = shapeNewTrbl.bottom - otherTrbl.bottom;
      }
    }

    if (topResize || rightResize || bottomResize || leftResize) {
      resizeNeeded.push({
        shape: other,
        newBounds: resizeTRBL(other, {
          top: topResize,
          right: rightResize,
          bottom: bottomResize,
          left: leftResize,
        }),
      });
    }
  });

  return resizeNeeded;
}