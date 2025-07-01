from datetime import datetime, timedelta

def sm2(repetition, interval, ef, quality):
    # quality: 5 (nhớ tốt), 0 (quên hoàn toàn)
    if quality < 3:
        return 1, 1, ef  # reset repetition, interval, ef
    if repetition == 0:
        interval = 1
    elif repetition == 1:
        interval = 6
    else:
        interval = int(interval * ef)
    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if ef < 1.3:
        ef = 1.3
    return repetition + 1, interval, ef

def next_review_date(interval):
    return datetime.utcnow() + timedelta(days=interval)