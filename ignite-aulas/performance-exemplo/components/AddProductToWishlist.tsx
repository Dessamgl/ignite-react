export interface AddProductToWishlistProps {
  onAddWishlist: () => void;
  onRequestClose: () => void;
}

export function AddProductToWishlist({
  onAddWishlist,
  onRequestClose
}: AddProductToWishlistProps ) {
  return (
    <span>
      Deseja adicionar aos favoritos ?
      <button onClick={onAddWishlist}>Sim</button>
      <button onClick={onRequestClose}>Não</button>
    </span>
  )

}