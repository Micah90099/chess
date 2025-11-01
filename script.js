const chessBoard = $(".chess-grid");

// turn indicates whose turn it is
// true whites turn
// false blacks turn
let turn = true;

// possibleenpassant stores fromtile totile when an
let possibleEnPassant;

// previous board states
let prevMoves = [];

// a list of move text descriptions
const moves = [];

// threefold repetition store of board layouts
let threefoldBoards = [];

// if game is over
let mate = false;

// helpers for move notation conversion
const letters = "abcdefgh".split(""); // file letters ah
const numbers = "12345678".split(""); // rank numbers 18

// intial layout of chess board
let startingBoard = boards.starting;

// 50move rule counter increments for each
let fiftyMoveRule = 0;

function classAdd(element, classPref) {
	// indicates whether were working in the
	const grid = classPref ? `.${classPref} ` : ".chess-grid ";
	// reset element classname to base tile
	element.className = "tile";
	// add the second class based on
	// note grid img element finds an
	element.classList.add(
		$(grid + "img", element)
			? $(grid + "img", element)
					.getAttribute("src")
					.split("/")[2]
					.replace(".png", "")
			: "BL"
	);
}

// returns number or number depending on
// this is used to move indices
function negOrPos(pieceType, number) {
	// pawn movement direction white moves up
	if (pieceType.startsWith("w")) return -1 * number;
	else return number;
}

// build and return the flattened grid
function getGrid() {
	let grid = [];
	for (let i of $$(".chess-grid .tile")) {
		// tileclasslist1 is the piece code or
		grid.push(i.classList[1]);
	}

	return grid;
}

// initializes drag behaviour for a piece
// piece is the piece element i
function drag(piece, i) {
	// dragelement is an external helper that
	dragElement(piece, {
		// handler fired when the user starts
		mousedown: (e) => {
			// if the board has class flip
			if ($(".chess-grid.flip")) e.X = 0 - e.clientX;
			if ($(".chess-grid.flip")) e.Y = 0 - e.clientY;
			// compute available moves for this piece
			var availableMoves = getMoves(startingBoard[i], piece);
			// if the game ended by mate
			if (mate) availableMoves = [];
			// add a holding class to the
			piece.parentElement.classList.add("holding");
			// mark each possible tile as available
			for (let i of availableMoves) {
				i.classList.add("available");
			}
			// store availablemoves and piece on this
			this.availableMoves = availableMoves;
			this.piece = piece;
			// add hover styling to the pieces
			piece.parentElement.classList.add("hover");
		},

		// handler fired on mousemove while dragging
		mousemove: (e, classPref) => {
			const grid = classPref ? `.${classPref} ` : ".chess-grid ";
			// if the grid is flipped invert
			if ($(grid + ".chess-grid.flip")) e.X = 0 - e.clientX;
			if ($(grid + ".chess-grid.flip")) e.Y = 0 - e.clientY;

			// for each available move tile check
			for (let i of this.availableMoves) {
				if (
					checkHover($(grid + ".center", this.piece), i) &&
					i !== $(grid + ".hover")
				) {
					// remove hover from previously hovered tile
					$(grid + ".hover")?.classList.remove("hover");
					// add hover to the newly hovered
					i.classList.add("hover");
				}
			}
			// if the piece is being hovered
			if (
				checkHover(
					$(grid + ".center", this.piece),
					this.piece.parentElement
				) &&
				this.piece.parentElement !== $(grid + ".hover")
			) {
				$(grid + ".hover")?.classList.remove("hover");
				this.piece.parentElement.classList.add("hover");
			}
			// if the current hover no longer
			if (
				$(grid + ".hover") &&
				!checkHover($(grid + ".center", this.piece), $(grid + ".hover"))
			)
				$(grid + ".hover").classList.remove("hover");
		},

		// handler fired on mouseup drop
		mouseup: (classPref) => {
			const grid = classPref ? `.${classPref} ` : ".chess-grid ";
			// remove holding state
			piece.parentElement.classList.remove("holding");
			// clear available indicators ui clean up
			for (let i of $$(grid + ".available")) {
				i.classList.remove("available");
			}

			// determine where we dropped
			// hoverpiece2 tile currently hovered if any
			let hoverPiece2 = $(grid + ".hover") || this.piece.parentElement;
			let preElement2 = this.piece.parentElement; // original tile
			const preDataTile = parseInt2(
				preElement2.getAttribute("data-tile")
			);
			const hoverDataTile = parseInt2(
				hoverPiece2.getAttribute("data-tile")
			);
			let html = preElement2.innerHTML;
			$(grid + ".hover")?.classList.remove("hover");

			// handle specialcase logic based on the
			switch (preElement2.classList[1].replace(/^(b|w)/, "")) {
				case "p": // pawn logic promotion en passant
					// promotion check
					// roundtohoverdatatile 8 floor 64 turn 64
					// this checks if pawn reached last
					if (
						roundTo(hoverDataTile, 8, "floor") ==
						64 - (turn ? 64 : 8)
					) {
						// replace html with a promoted queen
						html = `<div data-moved="true" class="piece"><div class="center"></div><img src="./pieces/${
							turn ? "w" : "b"
						}q.png" ondragstart="(()=>{return false})()"></div>`;
						// find index of new queen piece
						i = startingBoard.indexOf(`${turn ? "w" : "b"}q`);
					} else {
						// if not promotion check for enpassant
						// plusone is the direction offset to
						const plusOne = negOrPos(
							turn ? "w" : "b",
							Math.abs(
								parseInt2(
									preElement2.getAttribute("data-tile")
								) -
									parseInt2(
										hoverPiece2.getAttribute("data-tile")
									)
							) - 8
						);
						// if plusone 0 then it wasnt
						if (plusOne == 0) break;
						// if target is an empty square
						// and matches enpassant pattern remove the
						if (
							hoverPiece2.classList[1] == "BL" &&
							[9, 7].includes(
								Math.abs(preDataTile - hoverDataTile)
							)
						) {
							const enPassant = $(
								grid +
									`[data-tile=piece${preDataTile + plusOne}]`
							);
							enPassant.className = "tile BL";
							enPassant.innerHTML = "";
						}
					}
					break;

				case "ki": // king logic used for castling detectionmovement
					try {
						// if king moved two tiles horizontally
						if (Math.abs(preDataTile - hoverDataTile) == 2) {
							// default rook offsets for kingside castling
							let rook = 3;
							let rookTo = 1;
							// if queen side castling we shift
							if (preDataTile - hoverDataTile > 0) {
								rook = -4;
								rookTo = -1;
							}

							// move the rook to its new
							const rookToTile = $(
								grid +
									`[data-tile=piece${preDataTile + rookTo}]`
							);
							const rookTile = $(
								grid + `[data-tile=piece${preDataTile + rook}]`
							);
							rookToTile.innerHTML = rookTile.innerHTML;
							rookTile.innerHTML = "";
							// update classes on the tiles to
							classAdd(rookTile);
							classAdd(rookToTile);
							// mark rook as moved prevents future
							rookToTile.setAttribute("data-moved", "true");
							// initialize dragging for moved rook piece
							drag(
								$(".piece", rookToTile),
								startingBoard.indexOf(rookToTile.classList[1])
							);
						}
					} catch (err) {
						// if something goes wrong while handling
						alert(err);
					}
					break;
			}

			// place the piece html into the
			hoverPiece2.innerHTML = html;
			// reset style for the moved piece
			$(grid + ".piece", hoverPiece2).style = "";
			// reinitialize drag listeners on the newly
			drag($(grid + ".piece", hoverPiece2), i);

			// if dropped back on the same
			if (hoverPiece2 == preElement2) return;

			// fiftymove rule reset when capture or
			// if destination tile is not blank
			if (
				hoverPiece2.classList[1] !== "BL" ||
				preElement2.classList[1] == (turn ? "w" : "b") + "p"
			)
				fiftyMoveRule = 0;
			else fiftyMoveRule++;

			// remove old class from destination tile
			hoverPiece2.classList.remove(hoverPiece2.classList[1]);
			// recompute classes for hover tile and
			classAdd(hoverPiece2);
			preElement2.innerHTML = ""; // clear original tile innerhtml
			classAdd(preElement2); // set origin tile classes to bl

			// mark moved piece as having moved
			$(grid + ".piece", hoverPiece2).setAttribute("data-moved", "true");

			// flip the turn to the other
			turn = !turn;

			// create a text description for the
			moves.push(
				`${letters[preDataTile % 8]}${
					8 - numbers[roundTo(preDataTile, 8, "floor") / 8] + 1
				} -> ${letters[hoverDataTile % 8]}${
					8 - numbers[roundTo(hoverDataTile, 8, "floor") / 8] + 1
				}`
			);
			$(".moves").innerText = moves.join(", ");
			// store this board state fromtile in
			prevMoves.push([chessBoard.innerHTML, preDataTile]);

			// clear possible en passant unless we
			possibleEnPassant = undefined;
			// if the moved piece is a
			if (
				$(
					grid + `[data-tile=piece${hoverDataTile}]`
				).classList[1].match(/(b|w)p/)
			)
				possibleEnPassant = [preDataTile, hoverDataTile];

			// remove any css custom property that
			document.body.style.removeProperty("--end-text");

			// push the new flattened grid into
			threefoldBoards.push(getGrid());

			// check for draw checkmate stalemate conditions
			const draw = checkDraw(grid);
			// if draw or checkmate surfaced set
			if (draw)
				(mate = !draw == "Check"),
					document.body.style.setProperty(
						"--end-text",
						`"${
							!draw.startsWith("Check") ? "Draw By " : ""
						}${draw}"`
					),
					document.body.classList.add("game-over");
			else $("body.game-over")?.classList.remove("game-over");
		},
	});
}

// start sets up the dom for
// thisboard dom container to receive tiles
// classpref optional prefix used to scope
function start(thisBoard, classPref) {
	thisBoard.innerHTML = ""; // wipe existing board contents

	// iterate through startingboard array which contains
	for (let i in startingBoard) {
		// create tile element
		const newTile = newElement("div", thisBoard);
		newTile.classList.add("tile");
		newTile.classList.add(startingBoard[i]); // add piece class or bl
		// color the tile background with lightdark
		newTile.style.backgroundColor =
			((i % 8) + roundTo(i, 8, "floor") / 8) % 2 == 0
				? "#EFEED3"
				: "#779756";
		// set datatile attribute to identify the
		newTile.setAttribute("data-tile", `piece${i}`);

		// if bl blank then skip piece
		if (startingBoard[i] == "BL") continue;

		// create piece markup inside the tile
		const piece = newElement("div", newTile);
		newElement("div", piece).classList.add("center"); // center helper for hover checks
		piece.setAttribute("data-moved", "false"); // track if piece has moved for
		piece.classList.add("piece");
		const img = newElement("img", piece);
		img.setAttribute("src", `./pieces/${startingBoard[i]}.png`);
		// disable default drag behavior on the
		img.setAttribute("ondragstart", "(()=>{return false})()");
		// if classpref equals empty string we
		if (classPref == "") drag(piece, i);
	}
	// commentedout ui for player timers kept
	// thisboardinnerhtml
	// div classplayer blackplayerh3black playerh3span classtimeri classfa
	// div classplayer whiteplayerh3white playerh3span classtimer activei
}

// invischeck evaluates whether moving a piece
// it uses an invisgrid clone to
function invisCheck(firstPreElement, secondPreElement) {
	// flip turn temporarily because getmoves uses
	turn = !turn;
	// copy the current chess board html
	$(".invis-grid").innerHTML = chessBoard.innerHTML;
	// query the corresponding elements inside the
	const firstElement = $(
		`.invis-grid [data-tile=${firstPreElement.getAttribute("data-tile")}]`
	);
	const secondElement = $(
		`.invis-grid [data-tile=${secondPreElement.getAttribute("data-tile")}]`
	);
	// swap html to simulate move move
	const html = firstElement.innerHTML;
	firstElement.innerHTML = "";
	secondElement.innerHTML = html;
	// ensure classes are correct for invisgrid
	classAdd(secondElement, "invis-grid");
	classAdd(firstElement, "invis-grid");

	// for each piece that is not
	for (let i of Array.from($$(".invis-grid .piece")).filter(
		(e) => !e.parentElement.classList[1].startsWith(turn ? "b" : "w")
	)) {
		// getmoves in invisgrid context and check
		const moves = getMoves(
			i.parentElement.classList[1],
			i,
			true,
			"invis-grid"
		);
		// if any move attacks the opponent
		// which for invischeck means our simulated
		if (moves?.find((e) => e.classList[1].endsWith("ki"))) {
			turn = !turn;
			return true;
		}
	}
	// restore turn
	turn = !turn;
	// note invisgrid is left populated for
}

// checkdraw determines whether the current position
// accepts grid selector prefix eg chessgrid
function checkDraw(grid) {
	// 50move rule check
	if (fiftyMoveRule >= 50) return "50 Move Rule";

	// gather all piece elements excluding kings
	const pieces = Array.from($$(grid + ".piece")).filter(
		(e) => !e.parentElement.classList[1].endsWith("ki")
	);
	// filter pieces for the current side
	const turnPieces = pieces.filter((e) =>
		e.parentElement.classList[1].startsWith(turn ? "w" : "b")
	);
	// ensure king is present in the
	turnPieces.push($(".piece", $(grid + `.${turn ? "w" : "b"}ki`)));

	// if there are no pieces unlikely
	if (pieces.length == 0) return "Insufficient Material";

	// some insufficient material patterns single knight
	if (
		pieces.length == 1 &&
		["wkn", "bkn", "wb", "bb"].includes(
			pieces[0].parentElement.classList[1]
		)
	)
		return "Insufficient Material";

	// test if were in check by
	const inCheck = invisCheck(
		turnPieces[0].parentElement,
		turnPieces[0].parentElement
	);

	// iterate through each piece of the
	for (let i of turnPieces) {
		const moves = getMoves(i.parentElement.classList[1], i);
		// if a move exists moves0 is
		if (moves[0]) break;
		// if weve reached the last piece
		if (i == turnPieces[turnPieces.length - 1] && !inCheck)
			return "Stalemate";
		else if (i == turnPieces[turnPieces.length - 1]) return "Checkmate";
	}

	// threefold repetition iterate the threefoldboards array
	for (let i of threefoldBoards) {
		if (
			threefoldBoards.filter(
				(e) => JSON.stringify(e) == JSON.stringify(i)
			).length >= 3
		)
			return "Threefold Repetition";
	}

	// if currently in check but not
	if (inCheck) return "Check";

	// no draw check mate conditions found
	return false;
}

// getmoves computes legal moves for a
// piecetype string like wp or bq
// element the piece element
// ifcheck boolean used to bypass some
// classpref optional grid prefix invisgrid to
function getMoves(pieceType, element, ifCheck, classPref) {
	const grid = classPref ? `.${classPref} ` : ".chess-grid ";

	// helper to compute vertical moves for
	function getVert(movesPossible) {
		// up the board decreasing index by
		for (let i = currLoc - 8; i >= 0; i -= 8) {
			const nextElement = $(grid + `[data-tile=piece${i}]`);
			if (!nextElement) break;
			// if we hit a nonempty tile
			if (nextElement.classList[1] !== "BL") {
				if (!nextElement.classList[1].startsWith(turn ? "w" : "b"))
					movesPossible.push(nextElement);
				break;
			} else {
				// empty tile add and continue scanning
				movesPossible.push(nextElement);
			}
		}

		// down the board increasing index by
		for (let i = currLoc + 8; i <= 64; i += 8) {
			const nextElement = $(grid + `[data-tile=piece${i}]`);
			if (!nextElement) break;
			if (nextElement.classList[1] !== "BL") {
				if (!nextElement.classList[1].startsWith(turn ? "w" : "b"))
					movesPossible.push(nextElement);
				break;
			} else {
				movesPossible.push(nextElement);
			}
		}
	}

	// helper to compute horizontal moves for
	function getHoriz(movesPossible) {
		// left decrement until row start
		for (let i = currLoc - 1; i >= roundTo(currLoc, 8, "floor"); i--) {
			const nextElement = $(grid + `[data-tile=piece${i}]`);
			if (!nextElement) break;
			if (nextElement.classList[1] !== "BL") {
				if (!nextElement.classList[1].startsWith(turn ? "w" : "b"))
					movesPossible.push(nextElement);
				break;
			} else {
				movesPossible.push(nextElement);
			}
		}
		// right increment until row end
		for (let i = currLoc + 1; i < roundTo(currLoc + 1, 8, "ceil"); i++) {
			const nextElement = $(grid + `[data-tile=piece${i}]`);
			if (nextElement.classList[1] !== "BL") {
				if (!nextElement.classList[1].startsWith(turn ? "w" : "b"))
					movesPossible.push(nextElement);
				break;
			} else {
				movesPossible.push(nextElement);
			}
		}
	}

	// helper to compute diagonal moves for
	function getDiag(movesPossible) {
		// upleft currloc 9
		for (let i = currLoc - 9; i >= 0; i -= 9) {
			// break when move wraps rows detect
			if (
				Math.abs(
					roundTo(i, 8, "floor") / 8 - roundTo(i + 9, 8, "floor") / 8
				) == 2
			)
				break;
			const nextElement = $(grid + `[data-tile=piece${i}]`);
			if (!nextElement) break;
			if (nextElement.classList[1] !== "BL") {
				if (!nextElement.classList[1].startsWith(turn ? "w" : "b"))
					movesPossible.push(nextElement);
				break;
			} else {
				movesPossible.push(nextElement);
			}
		}

		// downright currloc 9
		for (let i = currLoc + 9; i <= 64; i += 9) {
			if (
				Math.abs(
					roundTo(i, 8, "floor") / 8 - roundTo(i - 9, 8, "floor") / 8
				) == 2
			)
				break;
			const nextElement = $(grid + `[data-tile=piece${i}]`);
			if (!nextElement) break;
			if (nextElement.classList[1] !== "BL") {
				if (!nextElement.classList[1].startsWith(turn ? "w" : "b"))
					movesPossible.push(nextElement);
				break;
			} else {
				movesPossible.push(nextElement);
			}
		}

		// upright currloc 7
		for (let i = currLoc - 7; i >= 0; i -= 7) {
			// break when wraparound on rows row
			if (roundTo(i, 8, "floor") == roundTo(i + 7, 8, "floor")) break;
			const nextElement = $(grid + `[data-tile=piece${i}]`);
			if (!nextElement) break;
			if (nextElement.classList[1] !== "BL") {
				if (!nextElement.classList[1].startsWith(turn ? "w" : "b"))
					movesPossible.push(nextElement);
				break;
			} else {
				movesPossible.push(nextElement);
			}
		}

		// downleft currloc 7
		for (let i = currLoc + 7; i <= 64; i += 7) {
			if (roundTo(i, 8, "floor") == roundTo(i - 7, 8, "floor")) break;
			const nextElement = $(grid + `[data-tile=piece${i}]`);
			if (!nextElement) break;
			if (nextElement.classList[1] !== "BL") {
				if (!nextElement.classList[1].startsWith(turn ? "w" : "b"))
					movesPossible.push(nextElement);
				break;
			} else {
				movesPossible.push(nextElement);
			}
		}
	}

	// parameter validation ensure element and piecetype
	if (!element || !pieceType)
		return new Error(
			"Function Error: Missing parameters:" +
				` ${[element ? `` : "element", pieceType ? "" : "pieceType"]
					.filter((e) => e !== "")
					.join(", ")}`
		);

	// if its not this sides turn
	if (
		(!ifCheck && !turn && pieceType.startsWith("w")) ||
		(turn && pieceType.startsWith("b"))
	)
		return [];

	// determine the linear index of the
	const currLoc = parseInt2(element.parentElement.getAttribute("data-tile"));

	let move;
	let movesPossibleInit = [];

	// switch on piece type without the
	switch (pieceType.replace(/^(w|b)/, "")) {
		case "p": // pawn logic
			// forward 1
			move = $(
				grid + `[data-tile=piece${currLoc + negOrPos(pieceType, 8)}]`
			);
			if (move && move.classList[1] == "BL") movesPossibleInit.push(move);

			// forward 2 only if square in
			move = $(
				grid + `[data-tile=piece${currLoc + negOrPos(pieceType, 16)}]`
			);
			if (
				move &&
				$(grid + `[data-tile=piece${currLoc + negOrPos(pieceType, 8)}]`)
					.classList[1] == "BL" &&
				element.getAttribute("data-moved") == "false" &&
				move.classList[1] == "BL"
			)
				movesPossibleInit.push(move);

			// capture diagonally left
			move = $(
				grid + `[data-tile=piece${currLoc + negOrPos(pieceType, 7)}]`
			);
			if (
				move &&
				Math.abs(
					roundTo(currLoc + negOrPos(pieceType, 7), 8, "floor") / 8 -
						roundTo(currLoc, 8, "floor") / 8
				) == 1 &&
				((move.classList[1] !== "BL" &&
					!move.classList[1].startsWith(turn ? "w" : "b")) ||
					(possibleEnPassant &&
						Math.abs(possibleEnPassant[1] - possibleEnPassant[0]) ==
							16 &&
						-negOrPos(pieceType, possibleEnPassant[1] - currLoc) ==
							1 &&
						move.classList[1] == "BL"))
			)
				movesPossibleInit.push(move);

			// capture diagonally right
			move = $(
				grid + `[data-tile=piece${currLoc + negOrPos(pieceType, 9)}]`
			);
			if (
				move &&
				Math.abs(
					roundTo(currLoc + negOrPos(pieceType, 9), 8, "floor") / 8 -
						roundTo(currLoc, 8, "floor") / 8
				) == 1 &&
				((move.classList[1] !== "BL" &&
					!move.classList[1].startsWith(turn ? "w" : "b")) ||
					(possibleEnPassant &&
						Math.abs(possibleEnPassant[1] - possibleEnPassant[0]) ==
							16 &&
						negOrPos(pieceType, possibleEnPassant[1] - currLoc) ==
							1 &&
						move.classList[1] == "BL"))
			)
				movesPossibleInit.push(move);

			break;

		case "q": // queen rook bishop
			getVert(movesPossibleInit);
			getHoriz(movesPossibleInit);
			getDiag(movesPossibleInit);
			break;

		case "r": // rook vertical horizontal
			getVert(movesPossibleInit);
			getHoriz(movesPossibleInit);
			break;

		case "b": // bishop diagonals only
			getDiag(movesPossibleInit);
			break;

		case "kn": // knight special lshaped moves
			// knights jump to distinct offsets in
			for (let i of [17, 10, 15, 6]) {
				move = $(grid + `[data-tile=piece${currLoc + i}]`);
				if (
					move &&
					// row consistency check to ensure no
					Math.abs(
						roundTo(currLoc + i, 8, "floor") / 8 -
							roundTo(currLoc, 8, "floor") / 8
					) ==
						roundTo(i, 8, "round") / 8 &&
					!move.classList[1].startsWith(turn ? "w" : "b")
				)
					movesPossibleInit.push(move);
				move = $(grid + `[data-tile=piece${currLoc - i}]`);
				if (
					move &&
					Math.abs(
						roundTo(currLoc - i, 8, "floor") / 8 -
							roundTo(currLoc, 8, "floor") / 8
					) ==
						roundTo(i, 8, "round") / 8 &&
					!move.classList[1].startsWith(turn ? "w" : "b")
				)
					movesPossibleInit.push(move);
			}
			break;

		case "ki": // king singletile moves castling
			// standard king moves by offsets 1
			for (let i of [1, 9, 8, 7]) {
				move = $(grid + `[data-tile=piece${currLoc + i}]`);
				if (
					move &&
					!move.classList[1].startsWith(turn ? "w" : "b") &&
					Math.abs(
						roundTo(currLoc + i, 8, "floor") / 8 -
							roundTo(currLoc, 8, "floor") / 8
					) ==
						roundTo(i, 8, "round") / 8
				)
					movesPossibleInit.push(move);
				move = $(grid + `[data-tile=piece${currLoc - i}]`);
				if (
					move &&
					!move.classList[1].startsWith(turn ? "w" : "b") &&
					Math.abs(
						roundTo(currLoc - i, 8, "floor") / 8 -
							roundTo(currLoc, 8, "floor") / 8
					) ==
						roundTo(i, 8, "round") / 8
				)
					movesPossibleInit.push(move);
			}

			// castling logic
			// only allowed if king hasnt moved
			if (element.getAttribute("data-moved") == "false" && !ifCheck) {
				// queenside castling checks
				// ensure three squares to the left
				if (
					Array.from(
						$$(
							`${grid}[data-tile=piece${
								currLoc - 1
							}], ${grid}[data-tile=piece${
								currLoc - 2
							}], ${grid}[data-tile=piece${currLoc - 3}]`
						)
					).every((e) => e.classList[1] == "BL") &&
					$(
						grid + `[data-tile=piece${currLoc - 4}] .piece`
					)?.getAttribute("data-moved") == "false" &&
					!invisCheck(
						element.parentElement,
						$(`[data-tile=piece${currLoc - 1}]`)
					) &&
					!invisCheck(
						element.parentElement,
						$(`[data-tile=piece${currLoc - 2}]`)
					)
				)
					movesPossibleInit.push(
						$(grid + `[data-tile=piece${currLoc - 2}]`)
					);

				// kingside castling checks
				// ensure the two right squares are
				if (
					Array.from(
						$$(
							`${grid}[data-tile=piece${
								currLoc + 1
							}], ${grid}[data-tile=piece${currLoc + 2}]`
						)
					).every((e) => e.classList[1] == "BL") &&
					$(
						grid + `[data-tile=piece${currLoc + 3}] .piece`
					)?.getAttribute("data-moved") == "false" &&
					!invisCheck(
						element.parentElement,
						$(`[data-tile=piece${currLoc + 1}]`)
					) &&
					!invisCheck(
						element.parentElement,
						$(`[data-tile=piece${currLoc + 2}]`)
					)
				)
					movesPossibleInit.push(
						$(grid + `[data-tile=piece${currLoc + 2}]`)
					);
			}
			break;
	}

	// unless were working on an invisgrid
	if (!classPref)
		movesPossibleInit = movesPossibleInit.filter(
			(w, i) => !invisCheck(element.parentElement, w)
		);
	return movesPossibleInit;
}

// initialize the visible board
start(chessBoard, "");
// save the initial board html as
prevMoves.unshift(chessBoard.innerHTML);
// initialize the invisgrid used for check
start($(".invis-grid"), "invis");
// immediately check if the starting position
const draw = checkDraw(".chess-grid ");
if (draw)
	(mate = !draw == "Check"),
		document.body.style.setProperty(
			"--end-text",
			`"${!draw.startsWith("Check") ? "Draw By " : ""}${draw}"`
		),
		document.body.classList.add("game-over");
threefoldBoards.push(getGrid());
