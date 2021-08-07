import type { Menus, Tabs } from 'webextension-polyfill-ts'

export function handle_context_menu(
  menu_details: Menus.OnClickData,
  tab_details: Tabs.Tab | undefined
) {
  console.log('porumai ... handling context menu ', menu_details, tab_details)
}
