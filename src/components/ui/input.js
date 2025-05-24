export const Input = ({ ...props }) => (
  <input
    {...props}
    className={"border border-gray-300 rounded-2xl px-3 py-2 shadow " + props.className}
  />
);