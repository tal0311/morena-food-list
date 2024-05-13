import { utilService } from '@/services/util.service.js'
export const shareService = {
  shareTo
}

const defaultMsg = 'היי, רשימת הקניות שלי נראית כך: '
function shareTo(platform = 'whatsapp', data) {
  // shareToMobile(data)
  shareToDesktop(platform, data)
  // utilService.isMobile() ?  : shareToDesktop(platform, data)
}

function shareToDesktop(platform, data) {
  const url = _getPlatform(platform)
  if (!url) throw new Error('No such platform')
  window.open(url + data, '_blank')
}

function _getPlatform(platform = 'whatsapp') {
  const opts = {
    whatsapp: `https://wa.me/+972524499064?text=${defaultMsg}`,
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
    twitter: `https://twitter.com/intent/tweet?text=${defaultMsg}&url=`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${defaultMsg}&body=`,
    email: `mailto:?subject=${defaultMsg}&body=`
  }
  return opts[platform]
}
async function shareToMobile(data) {
  await navigator.share({
    title: defaultMsg,
    text: 'title',
    files: [data],
    url: 'https://www.google.com',
  });
}

// shareService.shareTo('whatsapp', 'list: milk, bread, eggs')
