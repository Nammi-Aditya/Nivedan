import logging

from flask import Blueprint, request, jsonify, g
from services.auth_middleware import jwt_required
from services.agent_runner import run_agent

agent_bp = Blueprint("agent", __name__)
logger = logging.getLogger(__name__)

_MAX_MESSAGE_LEN = 4000  # ~3 000 tokens — prevents cost amplification


@agent_bp.route("/message", methods=["POST"])
@jwt_required
def agent_message():
    data = request.get_json() or {}
    complaint_id = (data.get("complaint_id") or "").strip()
    message = (data.get("message") or "").strip()

    if not complaint_id:
        return jsonify({"error": "complaint_id is required"}), 400
    if len(message) > _MAX_MESSAGE_LEN:
        return jsonify({"error": "message too long (max 4 000 characters)"}), 400

    try:
        result = run_agent(complaint_id, message, g.user)
        return jsonify(result), 200
    except Exception:
        logger.exception("agent_message failed for complaint %s", complaint_id)
        return jsonify({"error": "An internal error occurred. Please try again."}), 500
