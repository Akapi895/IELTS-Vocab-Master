"""Update tables: remove old, add new

Revision ID: b1e6ee0def05
Revises: 
Create Date: 2025-06-27 22:18:49.009806

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b1e6ee0def05'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_vocab',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('vocab_id', sa.Integer(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('last_reviewed_at', sa.DateTime(), nullable=True),
    sa.Column('next_review_at', sa.DateTime(), nullable=True),
    sa.Column('interval', sa.Integer(), nullable=True),
    sa.Column('ease_factor', sa.Float(), nullable=True),
    sa.Column('repetition_count', sa.Integer(), nullable=True),
    sa.Column('is_learned', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['vocab_id'], ['vocabulary_entry.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_vocab_id'), 'user_vocab', ['id'], unique=False)

    op.drop_index(op.f('ix_speaking_prompt_id'), table_name='speaking_prompt')
    op.drop_index(op.f('ix_user_writing_submission_id'), table_name='user_writing_submission')
    op.drop_index(op.f('ix_user_speaking_submission_id'), table_name='user_speaking_submission')
    op.drop_index(op.f('ix_listening_section_id'), table_name='listening_section')
    op.drop_index(op.f('ix_listening_question_id'), table_name='listening_question')
    op.drop_index(op.f('ix_reading_passage_id'), table_name='reading_passage')
    op.drop_index(op.f('ix_writing_task_id'), table_name='writing_task')
    op.drop_index(op.f('ix_exam_id'), table_name='exam')
    op.drop_index(op.f('ix_reading_question_id'), table_name='reading_question')

    op.drop_table('user_listening_answer')
    op.drop_table('user_reading_answer')
    op.drop_table('user_writing_submission')
    op.drop_table('user_speaking_submission')
    op.drop_table('UserReadingAnswer')
    op.drop_table('UserWritingSubmission')
    op.drop_table('UserSpeakingSubmission')
    op.drop_table('UserListeningAnswer')

    op.drop_table('reading_question')
    op.drop_table('ReadingQuestion')
    op.drop_table('ListeningQuestion')
    op.drop_table('ReadingPassage')
    op.drop_table('listening_question')
    op.drop_table('listening_section')
    op.drop_table('SpeakingPrompt')
    op.drop_table('reading_passage')
    op.drop_table('speaking_prompt')
    op.drop_table('ListeningSection')
    op.drop_table('writing_task')
    op.drop_table('WritingTask')
    op.drop_table('exam')
    op.drop_table('Exam')
    op.drop_table('UserVocabulary')
    op.drop_table('Meaning')
    op.drop_table('Vocabulary')
    op.drop_table('UserGoal')
    op.drop_table('User')

    op.alter_column('user', 'dob',
               existing_type=sa.DATE(),
               nullable=False)
    op.alter_column('user', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    op.create_index(op.f('ix_vocabulary_entry_id'), 'vocabulary_entry', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_vocabulary_entry_id'), table_name='vocabulary_entry')
    op.alter_column('user', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    op.alter_column('user', 'dob',
               existing_type=sa.DATE(),
               nullable=True)
    op.create_table('UserListeningAnswer',
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('question_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('user_answer', sa.TEXT(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['question_id'], ['ListeningQuestion.id'], name=op.f('UserListeningAnswer_question_id_fkey')),
    sa.ForeignKeyConstraint(['user_id'], ['User.id'], name=op.f('UserListeningAnswer_user_id_fkey')),
    sa.PrimaryKeyConstraint('user_id', 'question_id', name=op.f('UserListeningAnswer_pkey'))
    )
    op.create_table('Exam',
    sa.Column('id', sa.INTEGER(), server_default=sa.text('nextval(\'"Exam_id_seq"\'::regclass)'), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('title', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('exam_type', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.Column('total_score', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('status', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['User.id'], name='Exam_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='Exam_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('User',
    sa.Column('id', sa.INTEGER(), server_default=sa.text('nextval(\'"User_id_seq"\'::regclass)'), autoincrement=True, nullable=False),
    sa.Column('email', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('username', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('password_hash', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('dob', sa.DATE(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='User_pkey'),
    sa.UniqueConstraint('email', name='User_email_key', postgresql_include=[], postgresql_nulls_not_distinct=False),
    sa.UniqueConstraint('username', name='User_username_key', postgresql_include=[], postgresql_nulls_not_distinct=False),
    postgresql_ignore_search_path=False
    )
    op.create_table('Vocabulary',
    sa.Column('id', sa.INTEGER(), server_default=sa.text('nextval(\'"Vocabulary_id_seq"\'::regclass)'), autoincrement=True, nullable=False),
    sa.Column('word', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='Vocabulary_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('reading_question',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('reading_question_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('passage_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('question_text', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('correct_answer', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('options', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=True),
    sa.Column('question_type', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('order_index', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['passage_id'], ['reading_passage.id'], name='reading_question_passage_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='reading_question_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index(op.f('ix_reading_question_id'), 'reading_question', ['id'], unique=False)
    op.create_table('WritingTask',
    sa.Column('id', sa.INTEGER(), server_default=sa.text('nextval(\'"WritingTask_id_seq"\'::regclass)'), autoincrement=True, nullable=False),
    sa.Column('exam_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('task_number', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('prompt', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('image_url', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['exam_id'], ['Exam.id'], name='WritingTask_exam_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='WritingTask_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('writing_task',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('writing_task_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('exam_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('task_number', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('prompt', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('image_url', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['exam_id'], ['exam.id'], name='writing_task_exam_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='writing_task_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index(op.f('ix_writing_task_id'), 'writing_task', ['id'], unique=False)
    op.create_table('Meaning',
    sa.Column('id', sa.INTEGER(), server_default=sa.text('nextval(\'"Meaning_id_seq"\'::regclass)'), autoincrement=True, nullable=False),
    sa.Column('vocab_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('part_of_speech', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('pronunciation', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('phonetic', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('example', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('translation', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('example_translation', sa.TEXT(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['vocab_id'], ['Vocabulary.id'], name='Meaning_vocab_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='Meaning_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('UserSpeakingSubmission',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('speaking_prompt_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('audio_file_url', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('version', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('score', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('graded_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['speaking_prompt_id'], ['SpeakingPrompt.id'], name=op.f('UserSpeakingSubmission_speaking_prompt_id_fkey')),
    sa.ForeignKeyConstraint(['user_id'], ['User.id'], name=op.f('UserSpeakingSubmission_user_id_fkey')),
    sa.PrimaryKeyConstraint('id', name=op.f('UserSpeakingSubmission_pkey'))
    )
    op.create_table('speaking_prompt',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('speaking_prompt_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('exam_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('prompt_text', sa.TEXT(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['exam_id'], ['exam.id'], name='speaking_prompt_exam_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='speaking_prompt_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index(op.f('ix_speaking_prompt_id'), 'speaking_prompt', ['id'], unique=False)
    op.create_table('reading_passage',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('reading_passage_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('exam_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('content', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('order_index', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['exam_id'], ['exam.id'], name='reading_passage_exam_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='reading_passage_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index(op.f('ix_reading_passage_id'), 'reading_passage', ['id'], unique=False)
    op.create_table('SpeakingPrompt',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('exam_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('prompt_text', sa.TEXT(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['exam_id'], ['Exam.id'], name=op.f('SpeakingPrompt_exam_id_fkey')),
    sa.PrimaryKeyConstraint('id', name=op.f('SpeakingPrompt_pkey'))
    )
    op.create_table('UserGoal',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('target_band', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=False),
    sa.Column('deadline', sa.DATE(), autoincrement=False, nullable=True),
    sa.Column('current_score', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=True),
    sa.Column('achieved_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('is_active', sa.BOOLEAN(), server_default=sa.text('true'), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['User.id'], name=op.f('UserGoal_user_id_fkey')),
    sa.PrimaryKeyConstraint('id', name=op.f('UserGoal_pkey'))
    )
    op.create_table('UserWritingSubmission',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('writing_task_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('user_answer', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('version', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('score', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('graded_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['User.id'], name=op.f('UserWritingSubmission_user_id_fkey')),
    sa.ForeignKeyConstraint(['writing_task_id'], ['WritingTask.id'], name=op.f('UserWritingSubmission_writing_task_id_fkey')),
    sa.PrimaryKeyConstraint('id', name=op.f('UserWritingSubmission_pkey'))
    )
    op.create_table('listening_question',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('listening_question_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('section_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('question_text', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('correct_answer', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('options', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=True),
    sa.Column('question_type', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('order_index', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['section_id'], ['listening_section.id'], name='listening_question_section_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='listening_question_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index(op.f('ix_listening_question_id'), 'listening_question', ['id'], unique=False)
    op.create_table('listening_section',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('listening_section_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('exam_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('audio_url', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('order_index', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['exam_id'], ['exam.id'], name='listening_section_exam_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='listening_section_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index(op.f('ix_listening_section_id'), 'listening_section', ['id'], unique=False)
    op.create_table('ReadingPassage',
    sa.Column('id', sa.INTEGER(), server_default=sa.text('nextval(\'"ReadingPassage_id_seq"\'::regclass)'), autoincrement=True, nullable=False),
    sa.Column('exam_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('content', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('order_index', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['exam_id'], ['Exam.id'], name='ReadingPassage_exam_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='ReadingPassage_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('UserReadingAnswer',
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('question_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('user_answer', sa.TEXT(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['question_id'], ['ReadingQuestion.id'], name=op.f('UserReadingAnswer_question_id_fkey')),
    sa.ForeignKeyConstraint(['user_id'], ['User.id'], name=op.f('UserReadingAnswer_user_id_fkey')),
    sa.PrimaryKeyConstraint('user_id', 'question_id', name=op.f('UserReadingAnswer_pkey'))
    )
    op.create_table('UserVocabulary',
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('meaning_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('next_review_date', sa.DATE(), autoincrement=False, nullable=True),
    sa.Column('repetition', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('interval', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('ef', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('status', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('last_reviewed_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['meaning_id'], ['Meaning.id'], name=op.f('UserVocabulary_meaning_id_fkey')),
    sa.ForeignKeyConstraint(['user_id'], ['User.id'], name=op.f('UserVocabulary_user_id_fkey')),
    sa.PrimaryKeyConstraint('user_id', 'meaning_id', name=op.f('UserVocabulary_pkey'))
    )
    op.create_table('exam',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('exam_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('title', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('section', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('exam_type', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('total_score', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('status', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='exam_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='exam_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index(op.f('ix_exam_id'), 'exam', ['id'], unique=False)
    op.create_table('ListeningQuestion',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('section_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('question_text', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('correct_answer', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('options', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=True),
    sa.Column('question_type', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('order_index', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['section_id'], ['ListeningSection.id'], name=op.f('ListeningQuestion_section_id_fkey')),
    sa.PrimaryKeyConstraint('id', name=op.f('ListeningQuestion_pkey'))
    )
    op.create_table('ReadingQuestion',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('passage_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('question_text', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('correct_answer', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('options', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=True),
    sa.Column('question_type', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('order_index', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['passage_id'], ['ReadingPassage.id'], name=op.f('ReadingQuestion_passage_id_fkey')),
    sa.PrimaryKeyConstraint('id', name=op.f('ReadingQuestion_pkey'))
    )
    op.create_table('user_speaking_submission',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('speaking_prompt_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('audio_file_url', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('version', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('score', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('graded_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['speaking_prompt_id'], ['speaking_prompt.id'], name=op.f('user_speaking_submission_speaking_prompt_id_fkey')),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name=op.f('user_speaking_submission_user_id_fkey')),
    sa.PrimaryKeyConstraint('id', name=op.f('user_speaking_submission_pkey'))
    )
    op.create_index(op.f('ix_user_speaking_submission_id'), 'user_speaking_submission', ['id'], unique=False)
    op.create_table('user_writing_submission',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('writing_task_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('user_answer', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('version', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('score', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('graded_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name=op.f('user_writing_submission_user_id_fkey')),
    sa.ForeignKeyConstraint(['writing_task_id'], ['writing_task.id'], name=op.f('user_writing_submission_writing_task_id_fkey')),
    sa.PrimaryKeyConstraint('id', name=op.f('user_writing_submission_pkey'))
    )
    op.create_index(op.f('ix_user_writing_submission_id'), 'user_writing_submission', ['id'], unique=False)
    op.create_table('ListeningSection',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('exam_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('audio_url', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('order_index', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['exam_id'], ['Exam.id'], name=op.f('ListeningSection_exam_id_fkey')),
    sa.PrimaryKeyConstraint('id', name=op.f('ListeningSection_pkey'))
    )
    op.create_table('user_reading_answer',
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('question_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('user_answer', sa.TEXT(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['question_id'], ['reading_question.id'], name=op.f('user_reading_answer_question_id_fkey')),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name=op.f('user_reading_answer_user_id_fkey')),
    sa.PrimaryKeyConstraint('user_id', 'question_id', name=op.f('user_reading_answer_pkey'))
    )
    op.create_table('user_listening_answer',
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('question_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('user_answer', sa.TEXT(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['question_id'], ['listening_question.id'], name=op.f('user_listening_answer_question_id_fkey')),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name=op.f('user_listening_answer_user_id_fkey')),
    sa.PrimaryKeyConstraint('user_id', 'question_id', name=op.f('user_listening_answer_pkey'))
    )
    op.drop_index(op.f('ix_user_vocab_id'), table_name='user_vocab')
    op.drop_table('user_vocab')
    # ### end Alembic commands ###
