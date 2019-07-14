import * as firebase from "firebase";
import {firebaseConfig} from "./config";

firebase.initializeApp(firebaseConfig)

const db = firebase.database()

export {
  db
}
