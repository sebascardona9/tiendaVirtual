/**
 * Returns a function to call in the onChange of any <input type="file">.
 *
 * WHY: The OS file picker dialog blocks all browser events while open.
 * The inactivity timer in authContext (5 min) never sees a mouse/key event
 * during that time, so the admin can be logged out while browsing files.
 * Calling resetTimer() after selection dispatches a synthetic click so the
 * timer resets correctly.
 */
const useFilePickerReset = () => {
  const resetTimer = () => {
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  }
  return resetTimer
}

export default useFilePickerReset
