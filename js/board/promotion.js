import { UIBaseElement } from "melonjs";
import { PieceType } from "../chess/enums.js";
import { drawPiece, FRAME_SIZE } from "../piece.js";
import { label } from "../ui/text.js";

// The pieces a pawn can become, in the order they're offered.
const CHOICES = [
  PieceType.QUEEN,
  PieceType.ROOK,
  PieceType.BISHOP,
  PieceType.KNIGHT,
];

// Space between the "promote" label and the first choice.
const LABEL_WIDTH = 80;

// A piece to promote to, centered in a slot that lights up while hovered.
// The slot's left edge is at x and it is vertically centered on y.
class PromotionChoice extends UIBaseElement {
  constructor(x, y, width, type, color, onChoose) {
    super(x, y - FRAME_SIZE / 2, width, FRAME_SIZE);
    this.type = type;
    this.color = color;
    this.action = onChoose;
  }

  draw(renderer) {
    if (this.hover) {
      renderer.setColor("#666");
      renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
    drawPiece(
      renderer,
      this.type,
      this.color,
      this.pos.x + (this.width - FRAME_SIZE) / 2,
      this.pos.y,
    );
  }

  onClick() {
    this.action(this.type);
    return false;
  }
}

// A "promote" label and the pieces a pawn of the given color can become,
// starting at x and vertically centered on y, each in a slot slotWidth wide.
// Calls onChoose with the chosen piece type.
export function promotionChooser(x, y, slotWidth, color, onChoose) {
  const children = [label(x, y, "promote")];
  CHOICES.forEach((type, i) => {
    children.push(
      new PromotionChoice(
        x + LABEL_WIDTH + i * slotWidth,
        y,
        slotWidth,
        type,
        color,
        onChoose,
      ),
    );
  });
  return children;
}
