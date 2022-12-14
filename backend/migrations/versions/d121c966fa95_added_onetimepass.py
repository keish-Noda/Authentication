"""Added onetimepass

Revision ID: d121c966fa95
Revises: 7d1bcbbed280
Create Date: 2022-12-14 20:44:23.993279

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd121c966fa95'
down_revision = '7d1bcbbed280'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('onetimepass',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('twitterID', sa.String(length=50), nullable=True),
    sa.Column('password', sa.String(length=30), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_onetimepass_id'), 'onetimepass', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_onetimepass_id'), table_name='onetimepass')
    op.drop_table('onetimepass')
    # ### end Alembic commands ###
