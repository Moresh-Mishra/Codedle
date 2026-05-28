from fastapi import APIRouter

router = APIRouter(tags=["game"])


@router.get("/puzzle/today")
def get_today_puzzle():
    return {"message": "TODO: return today's puzzle"}


@router.get("/puzzle/{puzzle_id}")
def get_puzzle_by_id(puzzle_id: str):
    return {"message": "TODO: return puzzle by id", "puzzle_id": puzzle_id}


@router.post("/challenge/{challenge_id}/submit")
def submit_challenge_answer(challenge_id: str):
    return {"message": "TODO: evaluate challenge answer", "challenge_id": challenge_id}


@router.post("/guess")
def submit_final_guess():
    return {"message": "TODO: evaluate final guess"}


@router.get("/leaderboard")
def get_leaderboard():
    return {"message": "TODO: return leaderboard data"}


@router.get("/archive")
def get_archive():
    return {"message": "TODO: return past puzzles"}
