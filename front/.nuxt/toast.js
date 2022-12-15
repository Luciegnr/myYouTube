import { createToastInterface } from "vue-toastification";

export default function (ctx, inject) {
  const toast = createToastInterface({"cssFile":"\u002FUsers\u002Fanaispuig\u002FDesktop\u002Flast\u002Ffront\u002Fnode_modules\u002Fvue-toastification\u002Fdist\u002Findex.css"});
  inject('toast', toast);
}
