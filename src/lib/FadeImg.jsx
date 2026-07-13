/**
 * <img> that fades in when the file arrives instead of popping.
 * The ref check covers cached images whose load event fires before
 * React attaches the listener.
 */
export default function FadeImg({ className = '', ...props }) {
  return (
    <img
      {...props}
      ref={(el) => { if (el?.complete) el.classList.add('img-loaded') }}
      onLoad={(e) => e.currentTarget.classList.add('img-loaded')}
      className={`img-fade ${className}`}
    />
  )
}
