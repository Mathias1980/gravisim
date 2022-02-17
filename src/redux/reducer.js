import * as Gravity from '../module/gravity';
import {mllib} from '../module/mllib'
import {gravilib} from '../module/gravilib'

const initState = {
    
  objects: {
    selected: "-1",
    name: "",
    list: []
  },

  count: 0,
  body: {
    id:0,
    name: "",
    namelist: '-1',
    rad: "",
    dens: "",
    emodul: "",
    denslist: "-1",
    pos: {posid: "-1", alpha: "", dist: ""},
    vel: {velid: "-1", alpha: "", value: "", kg: 0, isKg: false},
    color: '',
    hasTail: false
  },

  active: false,

  ratio: {
    id: 1,
    anz: '1',
    einheit: 'm',
    text: 'Meter',
    meter: 1
  },

  random: {
    anz: 20
  },

  setting: {
    label: false,
    G: 6.67430e-11,
    realtime: true,
    timespeed: 1,
    restitution: 18,
    tail: false
  } 

}

const reducer = (state = initState, action) => {

    switch(action.type) {

      case "CHANGE_ACTIVE":
        return {
          ...state,
          active: action.payload
        }
      case "CLEAR_CANVAS":
        return {
          ...state,
          bodies: []
        }
      case "SET_NEW_BODY":
        if(action.payload.target.name === 'denslist')
          return {
            ...state,
            body: { 
              ...state.body,
              dens: action.payload.target.value,
              [action.payload.target.name]: action.payload.target.value
            }
          }
          else return {
            ...state,
            body: { 
              ...state.body,
              [action.payload.target.name]: action.payload.target.value
            }
          }
      case "SET_NAME":
        let id = action.payload.target.value;
        let body = gravilib.bodies.find(el => el.id == id);
        let ratio = gravilib.zoom.find(el => el.id == body.ratio);
        return {
          ...state,
          body: { 
            ...state.body,
            namelist: id,
            name: body.name,
            rad: body.rad,
            dens: body.dens,
            color: body.color        
          },
          ratio: ratio
        }
      case "SET_NEW_BODY_POS":
        return {
          ...state,
          body: { 
            ...state.body,
            pos: {
              ...state.body.pos,
              [action.payload.target.name]: action.payload.target.value
            }           
          }
        }
      case "SET_POS":
        return {
          ...state,
          body: { 
            ...state.body,
            pos: action.payload           
          }
        }
      case "SET_NEW_BODY_VEL":
        return {
          ...state,
          body: { 
            ...state.body,
            vel: {
              ...state.body.vel,
              [action.payload.target.name]: action.payload.target.value
            }           
          }
        }
      case "SET_NEW_BODY_VEL_CONTEXTMENUE":
        return {
          ...state,
          body: { 
            ...state.body,
            vel: action.payload           
          }
        }
      case "SET_NEW_BODY_VEL_KG":
        return {
          ...state,
          body: { 
            ...state.body,
            vel: {
              ...state.body.vel,
              'isKg': action.payload.target.checked
            }           
          }
        }
      case "SET_NEW_BODY_HAS_TAIL":
        return {
          ...state,
          body: { 
            ...state.body,
            hasTail: action.payload.target.checked           
          }
        }
      case "SET_BODY":
        return {
          ...state,
          body: {
            id: action.payload.id,
            name: action.payload.name,
            namelist: '-1',
            rad: mllib.round(action.payload.rad, 3),
            dens: mllib.round(action.payload.dens, 3),
            emodul: mllib.round(action.payload.emodul, 3),
            denslist: "-1",
            pos: {posid: "-2", alpha: Gravity.angleByPos(action.payload.pos), dist: state.ratio.meter * Math.sqrt(Math.pow(action.payload.pos.x,2) + Math.pow(action.payload.pos.y, 2))/100 },
            vel: {velid: "-2", alpha: Gravity.angleByPos(action.payload.vel), value: Math.sqrt(Math.pow(action.payload.vel.x,2) + Math.pow(action.payload.vel.y, 2)), kg: 0, isKg: false},
            color: action.payload.color,
            hasTail: action.payload.hasTail
          }
        }
      case "CLEAR_BODY":
        return {
          ...state,
          body: {
            id: 0,
            name: "",
            namelist: '-1',
            rad: "",
            dens: "",
            emodul: "",
            denslist: "-1",
            pos: {posid: "-1", alpha: "", dist: ""},
            vel: {velid: "-1", alpha: "", value: "", kg: 0, isKg: false},
            color: '#F27922',
            hasTail: false
          }
        }
      case "COUNT_UP":
        return {
          ...state,
          count: state.count + 1
        }
      case "SET_COUNT":
        return {
          ...state,
          count: action.payload
        }
      case "COUNT_DOWN":
        return {
          ...state,
          count: state.count - 1
        }
      case "COUNT_CLEAR":
        return {
          ...state,
          count: 0
        }
      case "SET_OBJECTS":
        return {
          ...state,
          objects: {
            ...state.objects,
            [action.payload.target.name]: action.payload.target.value
          }           
        }
      case "GET_OBJECTS":
        return {
          ...state,
          objects: {
            ...state.objects,
            list: action.payload
          }
        }
      case "ADD_OBJECTS":
        return {
          ...state,
          objects: {
            ...state.objects,
            list: [...state.objects.list, action.payload]
          }
        }
      case "SET_RATIO":
        return {
          ...state,
          ratio: action.payload
        }
      case "SET_RANDOM":
        return {
          ...state,
          random: {
            ...state.random,
            [action.payload.target.name]: action.payload.target.value
          } 
        }
      case "SET_SETTING":
        if(action.payload.target.type == 'checkbox'){
          return {
            ...state,
            setting: {
              ...state.setting,
              [action.payload.target.name]: action.payload.target.checked
            }          
          }
        }else{
          return {
            ...state,
            setting: {
              ...state.setting,
              [action.payload.target.name]: action.payload.target.value
            }          
          }
        }

      default:
        return state
    }
}

export default reducer