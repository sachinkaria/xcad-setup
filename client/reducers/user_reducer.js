import {
  UPLOAD_PHOTO,
  UPDATE_USER,
  BOOKING_LIST,
  LIST_EVENTS,
  READ_EVENT,
  GET_BOOKING,
  GET_INBOX,
  GET_CONVERSATION,
  GET_INSTAGRAM_FEED,
  PROCESSING_FILE_UPLOAD,
  COMPLETED_FILE_UPLOAD,
  SENT_BOOKING_REQUEST,
  RESET_BOOKING_REQUEST
} from '../actions/types';

const INITIAL_STATE = { bookings: [], booking: null, events: [], event: null, inbox: [], conversation: [], data: null, processing_file_upload: false, sent_booking_request: false, instagramFeed: null };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPLOAD_PHOTO:
      return { ...state, data: action.payload };
    case UPDATE_USER:
      return { ...state, data: action.payload };
    case LIST_EVENTS:
      return { ...state, events: action.payload };
    case READ_EVENT:
      return { ...state, event: action.payload };
    case BOOKING_LIST:
      return { ...state, bookings: action.payload };
    case GET_BOOKING:
      return { ...state, booking: action.payload };
    case GET_INBOX:
      return { ...state, inbox: action.payload };
    case GET_CONVERSATION:
      return { ...state, conversation: action.payload };
    case GET_INSTAGRAM_FEED:
      return { ...state, instagramFeed: action.payload };
    case PROCESSING_FILE_UPLOAD:
      return { ...state, processing_file_upload: true };
    case COMPLETED_FILE_UPLOAD:
      return { ...state, processing_file_upload: false };
    case SENT_BOOKING_REQUEST:
      return { ...state, sent_booking_request: true };
    case RESET_BOOKING_REQUEST:
      return { ...state, sent_booking_request: false };
    default:
      break;
  }

  return state;
}
