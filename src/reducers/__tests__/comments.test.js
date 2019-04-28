import commentsReducer from 'reducers/comments';
import { SAVE_COMMENT } from 'actions/types';

it('handles actions of type SAVE_COMMENTS', () => {
  const action = {
    type: SAVE_COMMENT,
    payload: 'New Comment'
  }

  const newState = commentsReducer([], action)

  expect(newState).toEqual(['New Comment'])
});

it('handles action with anknown type', () => {
  const newState = commentsReducer([], { type: 'LFDJSAFDJSA' })

  expect(newState).toEqual([])
});