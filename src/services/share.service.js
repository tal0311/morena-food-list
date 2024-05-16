import { utilService } from '@/services/util.service.js'
export const shareService = {
  shareTo
}

const defaultMsg = 'היי, רשימת הקניות שלי נראית כך: '
async function shareTo(platform = 'whatsapp', url) {
  try {
    await shareToMobile(url)
  } catch (error) {
    console.log('error', error);
    throw error
  }

}



// TODO: finish share ability to mobile. get inspiration from here: https://web.dev/web-share/ 
async function shareToMobile(url) {
  try {

    await navigator.share({
      title: defaultMsg,
      text: defaultMsg ,
      url,
    });
  } catch (error) {
    console.error('error', error);
    throw 'Could not share the list.'
  }
}



// for desktop apps:
// function shareToDesktop(platform, data) {
//   const url = _getPlatform(platform)
//   if (!url) throw new Error('No such platform')
//   window.open(url + data, '_blank')
// }

// function _getPlatform(platform = 'whatsapp') {
//   const opts = {
//     whatsapp: `https://wa.me/+972524499064?text=${defaultMsg}`,
//     facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
//     twitter: `https://twitter.com/intent/tweet?text=${defaultMsg}&url=`,
//     gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${defaultMsg}&body=`,
//     email: `mailto:?subject=${defaultMsg}&body=`
//   }
//   return opts[platform]
// }

// shareService.shareTo('whatsapp', 'list: milk, bread, eggs')
