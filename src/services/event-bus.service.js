export const SHOW_MSG = 'show-msg'
import { userService } from "./user.service"

function createEventEmitter() {
  const listenersMap = {}
  return {
    on(evName, listener) {
      listenersMap[evName] = listenersMap[evName] ? [...listenersMap[evName], listener] : [listener]
      return () => {
        listenersMap[evName] = listenersMap[evName].filter((func) => func !== listener)
      }
    },
    emit(evName, data) {
      if (!listenersMap[evName]) return
      listenersMap[evName].forEach((listener) => listener(data))
    }
  }
}

export const eventBus = createEventEmitter()

export function showUserMsg(msg) {
  const loggedInUser = userService.getLoggedInUser();
  let lang = 'he'
  if(loggedInUser) {
    lang = loggedInUser.settings.lang
  }
  eventBus.emit('show-msg', getMsgByLang(msg, lang))
}

export function showSuccessMsg(txt) {
  showUserMsg({ txt, type: 'success' })
}
export function showErrorMsg(txt) {
  showUserMsg({ txt, type: 'error' })
}

const userMsgs = {
  he: {
    'success': {
      loginSuccess: 'התחברת בהצלחה',
      logout:'יצאת מהמערכת בהצלחה',
      userUpdated: 'המשתמש עודכן בהצלחה',
      itemsCleared: 'הפריטים נמחקו בהצלחה',
      labelUpdated: "התווית עודכנה בהצלחה",
      restoreHistory: 'ההיסטוריה שוחזרה בהצלחה',
      newList: 'רשימה חדשה נוצרה בהצלחה',
      listSaved: 'הרשימה נשמרה בהצלחה',
      selectToSave: 'בחר פריטים לשמירה',
      itemsShared: 'הפריטים שותפו בהצלחה',
      noItemsToShare: 'אין פריטים לשיתוף',
      comingSoon: 'מידע זה יהיה זמין בקרוב',
      noItemsForSummary: 'אין פריטים להצגה',
      itemAdded: 'הפריט נוסף לרשימה',
      itemRemoved: 'הפריט הוסר מהרשימה',
      listAdded: 'הרשימה נוספה בהצלחה',
      listRemoved: 'הרשימה הוסרה בהצלחה',
      itemUpdated: 'הפריט עודכן בהצלחה',
      listUpdated: 'הרשימה עודכנה בהצלחה',
    },
    'error': {
      FormValidation:'אנא מלא את כל השדות הנדרשים',
      googleLoginFailed: 'התחברות עם גוגל נכשלה',
      failedToShare: 'שליחת הרשימה נכשלה',
      itemAdded: 'הוספת הפריט נכשלה',
      itemRemoved: 'הפריט לא נמצא ברשימה',
      listAdded: 'הוספת הרשימה נכשלה',
      listRemoved: 'הרשימה לא נמצאה',
      itemUpdated: 'עדכון הפריט נכשל',
      listUpdated: 'עדכון הרשימה נכשל',
      errorLoadingList: 'הרשימה לא נטענה',
    }
  },
  en: {
    'success': {
      loginSuccess: 'Logged in successfully',
      logout:'Logged out successfully',
      userUpdated: 'User updated successfully',
      itemsCleared: 'Items cleared successfully',
      labelUpdated: "Label updated successfully",
      restoreHistory: 'History restored successfully',
      newList: 'History saved successfully, watch it in the user page',
      listSaved: 'List saved successfully',
      selectToSave: 'Select items to save',
      itemsShared: 'List sent successfully',
      noItemsToShare: 'No items to share',
      comingSoon: 'More info coming soon',
      noItemsForSummary: 'No items to show',
      itemAdded: 'Item added to list',
      itemRemoved: 'Item removed from list',
      listAdded: 'List added successfully',
      listRemoved: 'List removed successfully',
      itemUpdated: 'Item updated successfully',
      listUpdated: 'List updated successfully',
    },
    'error': {
      FormValidation:'Please fill all required fields',
      googleLoginFailed: 'Google login failed',
      itemAdded: 'Failed to add item',
      itemRemoved: 'Item not found in list',
      listAdded: 'Failed to add list',
      listRemoved: 'List not found',
      itemUpdated: 'Failed to update item',
      listUpdated: 'Failed to update list',
      errorLoadingList: 'List not loaded',
    }
  }

}

function getMsgByLang(msg, lang = 'he') {
  return {
    txt: userMsgs[lang][msg.type][msg.txt] || msg.txt,
    type: msg.type
  }
  return
}
