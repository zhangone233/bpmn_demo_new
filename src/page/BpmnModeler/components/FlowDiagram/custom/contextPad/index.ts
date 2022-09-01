import CustomContextPadProvider from './CustomContextPadProvider';

// export default {
//   __depends__: [
//     {
//       __init__: ['customContextPad'],
//       customContextPad: ['type', CustomContextPad],
//     },
//   ],
//   __init__: ['customContextPadProvider'],
//   customContextPadProvider: ['type', CustomContextPadProvider],
// };

export default {
  __init__: ['customContextPadProvider'],
  customContextPadProvider: ['type', CustomContextPadProvider],
};
