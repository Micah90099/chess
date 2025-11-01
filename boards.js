const boards = {
	starting: [
		"br", "bkn", "bb", "bq", "bki", "bb", "bkn", "br",
		"bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp",
		"wr", "wkn", "wb", "wq", "wki", "wb", "wkn", "wr"
	],
	mate: [
		"br", "bkn", "bb", "bq", "bki", "bb", "bkn", "br",
		"bp", "bp", "bp", "bp", "BL", "bp", "bp", "bp",
		"BL", "BL", "BL", "BL", "bp", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "wp", "BL",
		"BL", "BL", "BL", "BL", "BL", "wp", "BL", "BL",
		"wp", "wp", "wp", "wp", "wp", "BL", "BL", "wp",
		"wkn", "wr", "wb", "wq", "wki", "wb", "wkn", "wr"
	],
	blank: [
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL"
	],
	materialDraw: [
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "bq", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "bb", "BL", "BL", "BL", "BL",
		"BL", "BL", "bki", "BL", "BL", "BL", "BL", "wr",
		"BL", "BL", "wkn", "BL", "wki", "BL", "BL", "BL"
	],
	stalemate: [
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "bp", "BL", "bp", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "wp", "BL",
		"bp", "BL", "BL", "BL", "wp", "BL", "BL", "BL",
		"bp", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"wki", "BL", "BL", "BL", "BL", "BL", "BL", "BL"
	],
	kingStalemate: [
		"BL", "BL", "BL", "BL", "bki", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "bp", "BL", "BL", "BL", "BL", "BL", "BL",
		"bp", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"bp", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"wki", "BL", "BL", "BL", "BL", "BL", "BL", "BL"
	],
	castling: [
		"br", "BL", "BL", "BL", "bki", "BL", "BL", "br",
		"BL", "BL", "BL", "bq", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "wq", "BL", "BL",
		"wr", "BL", "BL", "BL", "wki", "BL", "BL", "wr"
	],
	knightMate: [
		"BL", "BL", "BL", "BL", "bki", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"bq", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "wkn", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "wki", "BL", "BL", "BL"
	],
	rookMate: [
		"BL", "BL", "BL", "BL", "bki", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"bq", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"bkn", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "wr", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "wki", "BL", "BL", "BL"
	],
	preCheck: [
		"BL", "BL", "BL", "BL", "bki", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "bq", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "wr",
		"BL", "BL", "BL", "BL", "wki", "BL", "BL", "BL"
	],
	whiteCheck: [
		"br", "bkn", "bb", "BL", "bki", "bb", "bkn", "br",
		"bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "bq",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp",
		"wr", "wkn", "wb", "wq", "wki", "wb", "wkn", "wr"
	],
	blackEnPassant: [
		"br", "bkn", "bb", "bq", "bki", "bb", "bkn", "br",
		"bp", "bp", "bp", "bp", "BL", "bp", "bp", "bp",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "bp", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp",
		"wr", "wkn", "wb", "wq", "wki", "wb", "wkn", "wr"
	],
	promotion: [
		"bki", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "wp", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "wq"
	],
	kings: [
		"BL", "BL", "BL", "BL", "bki", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "BL", "BL", "BL", "BL",
		"BL", "BL", "BL", "BL", "wki", "BL", "BL", "BL"
	]
}