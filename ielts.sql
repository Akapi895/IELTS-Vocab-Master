PGDMP  )                    }            ielts     15.13 (Debian 15.13-1.pgdg120+1)    17.2 (    :           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            ;           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            <           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            =           1262    16384    ielts    DATABASE     p   CREATE DATABASE ielts WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE ielts;
                     postgres    false            �            1259    16386    user    TABLE     &  CREATE TABLE public."user" (
    id integer NOT NULL,
    email character varying NOT NULL,
    username character varying NOT NULL,
    password_hash character varying NOT NULL,
    name character varying NOT NULL,
    dob date NOT NULL,
    created_at timestamp without time zone NOT NULL
);
    DROP TABLE public."user";
       public         heap r       postgres    false            �            1259    16408 	   user_goal    TABLE     �   CREATE TABLE public.user_goal (
    id integer NOT NULL,
    user_id integer NOT NULL,
    target_band double precision NOT NULL,
    deadline date,
    current_score json,
    achieved_at timestamp without time zone,
    is_active boolean
);
    DROP TABLE public.user_goal;
       public         heap r       postgres    false            �            1259    16407    user_goal_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_goal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.user_goal_id_seq;
       public               postgres    false    219            >           0    0    user_goal_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.user_goal_id_seq OWNED BY public.user_goal.id;
          public               postgres    false    218            �            1259    16385    user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.user_id_seq;
       public               postgres    false    215            ?           0    0    user_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;
          public               postgres    false    214            �            1259    16423 
   user_vocab    TABLE     �  CREATE TABLE public.user_vocab (
    id integer NOT NULL,
    user_id integer NOT NULL,
    vocab_id integer NOT NULL,
    last_reviewed_at timestamp without time zone NOT NULL,
    next_review_at timestamp without time zone NOT NULL,
    "interval" integer NOT NULL,
    ease_factor double precision NOT NULL,
    repetition_count integer NOT NULL,
    is_learned boolean NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
    DROP TABLE public.user_vocab;
       public         heap r       postgres    false            �            1259    16422    user_vocab_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_vocab_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.user_vocab_id_seq;
       public               postgres    false    221            @           0    0    user_vocab_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.user_vocab_id_seq OWNED BY public.user_vocab.id;
          public               postgres    false    220            �            1259    16398    vocabulary_entry    TABLE     J  CREATE TABLE public.vocabulary_entry (
    id integer NOT NULL,
    word character varying NOT NULL,
    part_of_speech character varying,
    pronunciation character varying,
    phonetic character varying,
    definition text,
    example text,
    translation text,
    example_translation text,
    system integer NOT NULL
);
 $   DROP TABLE public.vocabulary_entry;
       public         heap r       postgres    false            �            1259    16397    vocabulary_entry_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vocabulary_entry_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.vocabulary_entry_id_seq;
       public               postgres    false    217            A           0    0    vocabulary_entry_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.vocabulary_entry_id_seq OWNED BY public.vocabulary_entry.id;
          public               postgres    false    216            �           2604    16389    user id    DEFAULT     d   ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
 8   ALTER TABLE public."user" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    214    215    215            �           2604    16411    user_goal id    DEFAULT     l   ALTER TABLE ONLY public.user_goal ALTER COLUMN id SET DEFAULT nextval('public.user_goal_id_seq'::regclass);
 ;   ALTER TABLE public.user_goal ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    218    219            �           2604    16426    user_vocab id    DEFAULT     n   ALTER TABLE ONLY public.user_vocab ALTER COLUMN id SET DEFAULT nextval('public.user_vocab_id_seq'::regclass);
 <   ALTER TABLE public.user_vocab ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    220    221            �           2604    16401    vocabulary_entry id    DEFAULT     z   ALTER TABLE ONLY public.vocabulary_entry ALTER COLUMN id SET DEFAULT nextval('public.vocabulary_entry_id_seq'::regclass);
 B   ALTER TABLE public.vocabulary_entry ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    216    217    217            1          0    16386    user 
   TABLE DATA           [   COPY public."user" (id, email, username, password_hash, name, dob, created_at) FROM stdin;
    public               postgres    false    215   �/       5          0    16408 	   user_goal 
   TABLE DATA           n   COPY public.user_goal (id, user_id, target_band, deadline, current_score, achieved_at, is_active) FROM stdin;
    public               postgres    false    219   r0       7          0    16423 
   user_vocab 
   TABLE DATA           �   COPY public.user_vocab (id, user_id, vocab_id, last_reviewed_at, next_review_at, "interval", ease_factor, repetition_count, is_learned, created_at, updated_at) FROM stdin;
    public               postgres    false    221   �0       3          0    16398    vocabulary_entry 
   TABLE DATA           �   COPY public.vocabulary_entry (id, word, part_of_speech, pronunciation, phonetic, definition, example, translation, example_translation, system) FROM stdin;
    public               postgres    false    217   �1       B           0    0    user_goal_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.user_goal_id_seq', 1, true);
          public               postgres    false    218            C           0    0    user_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.user_id_seq', 1, true);
          public               postgres    false    214            D           0    0    user_vocab_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.user_vocab_id_seq', 7, true);
          public               postgres    false    220            E           0    0    vocabulary_entry_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.vocabulary_entry_id_seq', 120, true);
          public               postgres    false    216            �           2606    16415    user_goal user_goal_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.user_goal
    ADD CONSTRAINT user_goal_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.user_goal DROP CONSTRAINT user_goal_pkey;
       public                 postgres    false    219            �           2606    16393    user user_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pkey;
       public                 postgres    false    215            �           2606    16428    user_vocab user_vocab_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.user_vocab
    ADD CONSTRAINT user_vocab_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.user_vocab DROP CONSTRAINT user_vocab_pkey;
       public                 postgres    false    221            �           2606    16405 &   vocabulary_entry vocabulary_entry_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.vocabulary_entry
    ADD CONSTRAINT vocabulary_entry_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.vocabulary_entry DROP CONSTRAINT vocabulary_entry_pkey;
       public                 postgres    false    217            �           1259    16394    ix_user_email    INDEX     H   CREATE UNIQUE INDEX ix_user_email ON public."user" USING btree (email);
 !   DROP INDEX public.ix_user_email;
       public                 postgres    false    215            �           1259    16421    ix_user_goal_id    INDEX     C   CREATE INDEX ix_user_goal_id ON public.user_goal USING btree (id);
 #   DROP INDEX public.ix_user_goal_id;
       public                 postgres    false    219            �           1259    16395 
   ix_user_id    INDEX     ;   CREATE INDEX ix_user_id ON public."user" USING btree (id);
    DROP INDEX public.ix_user_id;
       public                 postgres    false    215            �           1259    16396    ix_user_username    INDEX     N   CREATE UNIQUE INDEX ix_user_username ON public."user" USING btree (username);
 $   DROP INDEX public.ix_user_username;
       public                 postgres    false    215            �           1259    16406    ix_vocabulary_entry_id    INDEX     Q   CREATE INDEX ix_vocabulary_entry_id ON public.vocabulary_entry USING btree (id);
 *   DROP INDEX public.ix_vocabulary_entry_id;
       public                 postgres    false    217            �           2606    16416     user_goal user_goal_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_goal
    ADD CONSTRAINT user_goal_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);
 J   ALTER TABLE ONLY public.user_goal DROP CONSTRAINT user_goal_user_id_fkey;
       public               postgres    false    219    3222    215            �           2606    16429 "   user_vocab user_vocab_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_vocab
    ADD CONSTRAINT user_vocab_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);
 L   ALTER TABLE ONLY public.user_vocab DROP CONSTRAINT user_vocab_user_id_fkey;
       public               postgres    false    221    215    3222            �           2606    16434 #   user_vocab user_vocab_vocab_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_vocab
    ADD CONSTRAINT user_vocab_vocab_id_fkey FOREIGN KEY (vocab_id) REFERENCES public.vocabulary_entry(id);
 M   ALTER TABLE ONLY public.user_vocab DROP CONSTRAINT user_vocab_vocab_id_fkey;
       public               postgres    false    3225    217    221            1   �   x�3�,)M�+�H�5�0�4200uH�M���K���'�b��bh�R�������URZ��W�Wa��VR�k��a�_��_\R��^P斛aT�a����p��\Ǽ��҇���q�L�5��5� 2��Ls]CCS+#+=SSC�=... ��5�      5   M   x�3�4��4202�5��5��V*JML��KW�R��3�QP��,.I̓� �����nyQf	�W���Y����� ��*      7   �   x����� @�x�.�6�Yz��#4��&�$����IJ�H#�uAzP�$�93�����Y��_~@�[�Pv�&�;һ��d�P�@�L�f%�wT��? (�;����-�6?�2���o���s�:NhG�n\U����:>��m���+ʊ;Z��\�O����Wz@����8!]��$�c�����S? xf x�	�7      3      x��}[�ב�s�W���J-�)���G�-KXў`_NefW�:/��tw͓����j����V���-��dja���@�#�_��}'3�����,b_Ȯ�̓y�ĉ�q�&q���h������s�<��z��uR䮜�S��LG�{fZy���ï�3q�x�5����`���׿H�����x	?<u"(���A�F�l�4��`\�q�����Kq0v�q���h��C�N�K��d�>�����[u�><|/џ���Ͼ����������J>	|8�����R��}�����9k�ݎ��c���B'�$�$8��N����(�fA'��HRO�*Ȋ2'��U'����ˬN�z���_$�I�?r���^�?rA��9ȑ�&z�&��u\�sr�y�Wڅ�*�65o9T.���I���\Y\�19!�ʋ�4�ƽ���[U�����e\�y�A��� ���Ʌ냗���Z�Q������0����`k�c�i�H�{��j��䓇w�zx������Ϲ�`�<<�yD��R��X��	�|+	�1�^��o��h��j'.�]=��:N��#	�^*v�����4�����%���N=<�Pk�H����7�*5h�'����/�Ȧ�Խ����4�?����^��� P��4�VN���q�lIȮˋ:�ؕ���`+|�<W��Ҥ�c��!>᪎�AX�_��@����Rɯ�L)�Z�_��Cd]�x��c��p��k*�x;�Z8Jx��Ͽ����M�
�-������,�w�/:L��#����d)��]Z�޺QЌ�)C><�[[2J-c������������c}/�~}��\��N�Գ�.�$�⏉����J�D.�deq�a3.K�[.��*��.B"�m�T��m�%��)�V�J"w�ba�B8d�>�ע	^o*y\��U��{K��&�O2�@7d��1���1[M�\8�'���NX�3������O�i�s�U�,ɼE9�[&��������M��g�?k�G�����nX��������S^,��|�/����`��UD�M�޻ �':�[P\��r�Lu�ȥ���� o]z�CL�]�
���Ϳ�[g&�ǡ�l�?��0ظ �M�}>�	�h���IQ݌��d)�Y��^&\2�[|��0���߯�F��B�YP:��>�	���@�g#�$WgT>��/o>����",��	a{��NP6i<R�C�W�Df�}Q�]���CD6���I�i*Z���j��nC�߻�DԮ�I�n�Gf�����~	�ɍL�b��
��I7�5�#\��p���	��;b��<���*��M�
Bf5���D����lC���od�]j���ڙ���ˢ��a�b�� �ˏ�_XdS��9|�宾����RȌ�E�e��б$l7悝�O`v��L��GG� �K=3�R��ux��T���_ �=�&6x���KAa	Q�"gTҮ%�|ؤy,b�eI:S��4S�\V3Q�-���v��RQ����y#T���2$]N��e����_ƉÆ�4����`�R'C5�gFr�VBQ*?�I$�\�R~��Q���H�3/YʸnJLB.�$���@8'�RJ�כr&s.��Į7I*s���M(�
f�X��� Q�&#�J�
��'�f�h�9�z����0Hj%������B�]�x?	!�8$����#Ty
�
*T9��R%�N�t�GEQV½E�FP���od�bǕ�`�W�I���Ӳ��E�������2�2u�c*.�=緂i���9sn0*f��D��O7u���o�~��-1�djxq���]M���~ь���N���d�/�t��h���$6��sY�/e��5�M�6
�WY���qN�αe��W0��(ɒ�����Tp��H��9�^��2�����8c���tQ�T���eMx��vF���S����B�疅��v:a�R��R�Ũv�_�6����MA�7UbN��O�Le��TL�$lRW��{V��X �=1d����-��dFQD �0p鎛UtAV�M`�o���O�!�M��0�~^��h��L��-�`m
�ES7���p&�sA��y�X�=���K��ŕ�EO�T��J#�`M��Xn�"��4~��p�B�`�(�I*v$�����dC��b�=�9	�@|�V.��������Iܕ��6���v=d� ���&��Syף�A!Wӈ��[�7O-��=������9�K���[4���;��;��~���wje���MC?����>k�j��_��@k�=v��>W����g���c�U�ri;1��/]s險�����8�������H]\-21pvb��������r����U*�-�.ކp��'G���K{���5��S�z��Iy�����Uc�ŕF��B�\�=�*{���5��0��k&���S�:�#��������.B����7C�M0�d���I�j����D��������e�A�H��������?�2��8F�<7�NE�F#�	&���U��� [�Ϳ4�~��jٌ�o��>���]�`)���;�DԳʀ2�2�䀜����'���:5�:"�E��p��O�)�&�x�����҅�c4u>��=���Km_2%V��Mx�X=Cx�z�����=�!~��Xb�+�y5~xx���p��4��",�j���B>|O�q�E�e�R}�[�V�Ÿ�:)/���?:�>��-���e�,���{���0G�q�3�B����ۤL�ɇ`|l�3?B
.���(�� ����Sx~�{x��Q	��Co��T�l�l���~ELA?���z��J	�UDPJ��o�q�]���0Z!��0��'E!ⶩ<��b4��,:4I�r��\�*%�ׁ!���Nh*O�F{7���^@M��E�e��_�a\0P���k�(2�0wn�%�F��b	E�0��ڈ"�>�,��ES���g��Q���O��:��5y).�$']�4BG籊��
F-�L��\���;0��iDX'�-~�>߄��-?�mc��2��&grvj
oa^zbA�zu�>��˿bl���D�E����(v0�MQ�}��L{�G��Y-e3��0�׷�O���*x�v��9GR�� ������j�
��r{��ݣ\;���#�'�!���P���Q���\�����`+X.n}�]Z� Y?5x�'�E�~һ[ըJ�67v�m5�L`A A��-Oa~�W3?�����`�:MFpef�&�@�����T.�p#�aG&������v�(_a!��^������Nkk�m�8������[]�g1`�Y�� j\�n�����5D}��VeJ!�] �ڽ�Y"s�6]ɲ��,	<�>l��4/���g2l��&_氰�U#��s���f�����,�N�c���/�4�&KX5�L*X�i��s�i����B8Mׂ�_�E`��.w�{J���9����n{�-�6Pó������`+h��19��8#� 4Ջ�PK���.*�H�Qn����#�9A�����ٸL �V/vt�'�f� ��o3��8��:�/Z�=��(BC�J����ɉ��j�[]:�O�"��f:@����l�}H�w�@��E}l��T����܏-zǸ�XsW}�ɧ�J���_��%��#���uy��da���|L"h'~_�������E#��*)6�@��";-1�ߩo�K�Ab�ɂr~�1zf�KJ8�gW0�RX�F,N���e_�)^�<�*p��W�4�P�<5�[a�!��w��:s�+��Kz��a�י��`�u[<�x�]/�`��XDb;$��ahu�K�>��D�5*E̬�l��(��X�H8p��鑄���-[ ��{�$�s��'��n��c�j##s�Mϝ^%�\ng�9g�*�kQuP��V�8��WA�	����$E4B|#șW��G����t�M�5�Ě,1�i+��!6���l�O��]�ߌ6����
fn/d�����У6@X�z��E��t�6ȹ��h��{�y��_ ��4�PBU��T�q3� �    G��_���������H�F�	�~�(�_���Ҹ�q�J?�����5���v4
j��@Xm7�A�Gثc�|�����8�m�؅_}V�h�1;fY���%�/ܸ;\{T�˾j��N7�	��������ᇡ��@\����9'&����˵�i����O�HvF���zp<v�q��k�tZT�k�x���e��"Zr�eS�*^���S��~J��9��]�!����Z,�_�K�R~���E+��Ē�j��2����oX{]8>{B�������\�L�	x[L������������<����`����d�|o<�>D��&&�S0j�&H�I�s�V �5Uxa���4�)�n0���P�j�""-�;�esIS��P�<�bCd��d�_�e{�����
L5��S��f��x.նB左����M�5D'Ũ�*�����&�Oׁ�2�l�!HV�P�HWa��LHZ#L��6�T�ioR�����tֵ���_Μ>��	�'
Ǒ�v�X�ʧ�O4�\�J��ؿ-���=����hd��~�]�߶����w<&�<~h3��d�XF��{f�(w�:�
[�jfDh��@p�cd��![��j#He�ߣHkMQ�lc!dA�zƨ��0�L6�,Ic��J��?�ݾ���V����Vb-#�S��w	~��˰'���̀v�������F���.�����c�A�+H��D�bN!�E� ��F���7�f<�+��k #^"M��!GDQ�dO�()���0������nm!f��] ��Lz �p�Ac�h�.�?"�ޟyc�J����N̅[ba$l�s���[Ϧt:6�
SQ�b�	_9�kťO�0fO��\�YtY���f�#���-�\1��̇dPlm�A�� ԑ�jϸ�ld�^/�A�%C��q+��o�]l�y'�e�L_��~�q��z)R����+���6��,�-l��M��h5@B�R�HiR�4h×$�a�Q��[��ÃO��`�v�����j��ƇZo�ة�A5)�	�]r��=plۺa\��G�u�W@1��6kQ�q6����Ms�[=�D�ղy�YɆO��shQTdN���"��o� ^�Y��?���D�1cv+��w@U��Y8������S>۠�˦5uw�F��O�l�י<�v��/@C�	hap~�)�eE�W�1��LX��#���2c�b]�h�q��Yft����/,M~�b�.������x�3���+�rza��jJ��:ǭ$�r�߶���uBF2����%�>~!\!,�Ǌ�ỵ�g+M��8�$�����e�)�x��N�D�#e0��翾��(}��'�F���LNl����e��m�H��t��Y��у/�R>�C�h ��'��(E5�ET��"�=�:j�)����`�WJ0@�ڊ�S��q�ܷ,s*��me���۩ȎV�?��Qӫ[��V�K�%0|/VR�#�A�2~mk�/2��F�@�,Er�?�2���Xp�:�ɨ����QR��&yT����	���	��p�M�]�i��u��,Ef�5m����M�*���o�lX��;,���ٖ�{��|��ur*j1oJ@�61X�k%/���E����n�=*�vT6�2���E(�鑴
�* dOe�#M�O؎�k8-���K%�u�� ���?6򷍘c�8h㊋1�`(�]\%�D�ɞ\s�\WMR#F��ī�U^?8���󶳕�r�L$ R)Q�n7�w��'�hq̖�:kXA�C�B kOF�?�Ρ�E(�M��P+*1L�R&���O����JRb6��7,
ڄ�gT��!�/��F�&6�Lı4ag�j5t� ��n�%�dbc6�)<1R�����ܾOr�{���$ӻ2$��j�ܨ��_��O�-�.�׎؁�Xד��Q�])Q��$A�I��p(`~��T��"BF?�9e"0^f�u⼧X:��à�^�ٓ�tca�_��)R�8ё�ԩ��~����/��4��z(B
�
���8�[�JO���I����F��daZ�C|�� t�1-+3����bi؃MSk�}�\�C�,F��X�9W	�D�݂h��ě��f��5�eRޤQQ?���\�ʜǒ����bΡX,��'1���S����Մk�T��������g���N\.,�by�+m ����i�g�a	��Q`?�����Ń����2���
5���\lM�8fj��"�����Y��bǴZ�����u��eZve��Pm�»�Y�f��kz��Iw�G��&�h���0�?6�'�En�]�HV:�z�}�xIO�!��[�!cG��P��ڵ���V��M�ȧ��2pY#r��f�P�@�����m&�ƭI��/�l2ApW�kG6��lKf�����Z1Ƨ�,��#��dhC���������jZ� ^�����{�C5)�Be��#���bm��ni|�!��w� A��.���� b���U����Ï���X�"��~ά_�pXI2�_=��+�g�F�B�pN��W��5O���<!@��
쎰�5w"�3�������8���@�p�����~n������	!�1���f�,�b]h/�r�>]�×ZN���3¿W��Y[I��F>�,�ԅn��"X^)Y��a���N����3J*@����=�BK0K��:y��6��� �d>�)C�9/�jZ$j�_?NZ�Eھ�����W�#�w�#F)���,��O�T��^ݽ���2�����W��-E�vt�����may����_UN��k�Jo%zG�^�3��m$>BJK����G��/\z"�j�:A�Ò����x���Q�b�*�Y���٤Cӓ)��k�F�D��b*�/G�8Z�p)����	�P/�,>M I�w ͋��0I�įj���qMq���@w�g������m:�M�J�hM�οtr��.ѳOb�Lv���K!�O�J���|��rә��vuU^.�N�Wm4��c,)���=�'��b�U+�)KF��>�c���|/3�]�&�����R�� �]c�1:�	��^���-��+��J(����P��R�^"��K�I�x��BFAs�g/!�-�t!,��RY��֙�����dq������G+��z-&9��X$k�,4��[��MB�x���#�1T�⇊S^���bX������	Ž�1ɐ7�H�u��3l�!]�Р�J���F̚<j���\�Zk&����ݤҮaz1�����Lh�T�I�K�_�ߧ��������[�:k'�h*s���̆m�X?`��$ ����-zT�-���>o��-��Z<ؾ)�>�=��(�]���h���p	F�1��{��K�Y�[�JkM�ï#�~/-�Ƃ�7!#�vG+�;�Oi�W.��X�D�2KF>nE�+��\�J�*�E���&h]�� ┻UF�@��f�0AK�CO�TAj>�h�Y��a���$�a�ų+��1&թ�=g��9�h�����-$�{�?,�S�Xvr�K!��Z��b���ǻ���&�<R.R�o����������൶_�(��!��F�c�����i�!qQ/V�Fp��6(J���c��U��+p��磰��w�m���|��$"[�*�	�8��Z'���*%b�#Q�̖j�H��Ja+Ix�D�b�PK�}�#mq���R�3K�
GF(0#
��3�v�
��2�PI,J�'�h�R�E�u�����%�dx��z���ނ�7iJ�t����*z!�np�4Σu�c��e%��I#�;Qt��@)$ �����ϰn�kJh"��������������_�Z�����Pf��P�梈���r$\�b�N�qi�Ţ���r���]���j%�D�8�ز|���ѩIV�{�a�x3yH�{Q��f&�)��lJP:�DD��=�{Vg	��⚭E�ӵu�HhJ�#,x���l�}@L��&��Q���vX��������P/��C�ح�͒�֗�]�<�"\tt�1��c,    ��������X�$���\�[D1�Q�-��ϵ�7���B�b�L��ZZ�C�.�g�'
`w��C���`����
i�����R��]	Wݷ����bힽb1��a�|`Y�_j+��T%�d]���� �w��$hQ%�2;`U�󩵫��֥����[q�a	�?˦�ҬU��#]����>ےL��Q����U�n>\٬�G�V[ +n�k��2�{��d=�^�U^�\<}�D�V�c�b����e�����/d��������wV�z��㕹7��(�6xIK x	L:7Q�.�1҈�+Ka�D�W �M����RCM� ��h��W{����[d���.��&~�V��ۦi�&�B����+��+!����,°)K��̘�����ᘶA�[�-X�"q�f�8�-}�r�+h{xp��&|���7�*�aĿ���t�	�Ȑ���&{��J�x�̇�<_�����>*�k�����	Z�u�aqo�n���Zó�������o���gu��4%WF���3��PI�uY|mծ9S{O˚}F1(�$m�KgVϪ��+6Ԟ�`U6i5>4���YkW�p�_������)�X-���e�_�{���(��n��V���,�|><��){�C$�_��JQ�������%�&v?�-u�I���ϵ?o	�(��!#_�,d�pf���}5���'�զI�������:c�t��H�����F%�&*��b�(mf�z��(ek��e[�������0�GY�fɣ�'�a;�ٱw4���v�i��Cx�U����/�-+p�	� ӕ"�z
 �S���5��Y�&g���λshj�F��zVD1DE�R��
ž|�����.]�1K񢓱�&ω���5��Yb��^��=���p�����]��':��@���c?��Jki�sLVY��&��A����NM��ͩ0�65�t7g�[���Wm�n�b|�f�}���4떴�\@�_:�r6[˴���s3��	�Xd4{�E�t��UC�h��2`�(;h!��@�m��Ť��?TC��V��]�����ۙg���X��bN���ɰS�t�;ړ�8Y�]��p�2�b ?Ǻ�����G],��C��"����)����]/�G1���r�R�mش��5O�m�4p���b�i{���`ͽ��at��-XW%W�«+�����f��3y����g��y��agP2�kb����#����'̟��-ظ��<�����+My��J��@�,TF0�C��e�sbt�x�;��)k�D۷se�d�;�4Z�lq��y���BsT�,{�X��7"U�Ǿֵ�^���.��G�7��1PՄ�B�j{��XR�Fm�o��� d����P�"�
�s	�ڏF/�>���BR6��E(گJ��I���7y���WA�V��	��e	,-��`�ړ���*����l�sҊ�Ջ[��]�ֱ#���ʚ�W�,4���V˦v�!���ib�����J��~?�;v=�:�J^�J�eݥgh^��AX�=6�j�������_ �ó�z"b��ڜ&F���~������4��)������.17V��ڦ`}p�^�-� ��fM�t�(���I�|��'�Av����v�jM@��'�LУ��ّ�2�Zs�������z��ڽ��g�������4N@���*�jk��� �K���*�Ј!�1jA�)�ds�|d �������;1E�?��د>Cd�Ɓ(���[��Qz��gGc��{j@K�
��oS�<{z�j+6S�.s�_u�������o��ǯ�ݾ`�54�K�B0l�F��c�+D�:{�'@�BHl�&�_�Ԗ!+	d��u`)��`��}j�Ԑ���k�z�%���ᑀ"< �Wׅ��L��GI�Fw̕���g���D�L�	1�P����\�=�m۞xy��­��;TXpmb�N�HV'�������R(}B�?��I�Xh�6�v�L�Xg��@��)�>i��/]�c�����gD�h���,>�n���^^Ͽ8��X?4]'��{yY����,ƴE���7�j�Jl��1��δM�2#]���������ԫݧ1*k�4-B:�ӕ�Uu�^\��5��g[�����R�8�gm �!;��f�F�k�E�A4 ���l��ǠsRާ�V�i��/��W�����a��@>�[Y�Ql�(=���ߴ)f���&x좧	7�-���@)t����Et���jq�!�>eGG����mϥvH,$�Qf�Q	j�V}=�����=�`Y+l�E�'a���µB�b5��T$��"�TD���H;��)�'3@m�ZS f��kk	.��H�t�:,��w[#�(t��.�#YC�H�t��o;�{���-�pd@CP��^�Zkt�C�p��\)ӞXI��g�����u���^ְ�*	�W�������J�:Ƕ�<�l�a��j2@7�
0}�hĝ�=l.���l�g��J>.OO����3M.&w)<���٥md���a�����i��ai�9��V��ېm����w����Q��w'g(��h���pڂJo��}_4݇�����M ��ص]��vTR�b��t�p(^��K�uYf��Z���Zh9N`�s��<��|��W&���+k�?6һ�N�Zm��rѡk�G��in�mT�?ȇ<9"*z�\-P���Gfծ���������0"�緋� �g/�'�d�2(vDDT�dJ�܈ܲO��$l�q35-D�%˄z��4*��f��.���5]ٚ��s���2��q9
R�-,gCѣ{�g8�t�P�Fn�h����^�i,DMd[�]��ۓF���H�����(7�E3ճ{�P�#�oD��~)[o�*'>)cWx+���
�q<�1�?r�q=�&yls9ؔ��aI���-�{����{�w0]{U�3n��R#���+�/f�,\��1eGp�A�����g�59z|�hWǣ�ff�
�(B�]K�\z#W������ܢ��^a��#���i3�&�q�GŸR�Y(�|��A�k�J�V����l���I�'�p��y(zp�'�0����|۽`�̀��ݍ6���F%nm�
}��|!zlJO )�;��P9�#��m��~��I���T��'D_E�\^X�Y��xb��ǋ�o�^s�8e�+��"4ȹ��n��R�n�X����8��`��7'�?8Hob�[�ۧ�}5vs���ϬJ��q�;B{ ��	��M�Ǌ�݌�0$��<�jJf����l���b�(�Ӟ:"�8�^�2��0����{	5�w�f�ɑ�Э�����
EX\����'xxWh���ZJ�F�Q��쓡&O�-4O��CI�W�={�>���>��>�R߄QIbŲ�Ū���P�"bC�|Doh����O��o�ظ�r����qփF�驪�����*���>��6�<m��A��qWC7����V�l�HH9F6���q.�`���s�Y��V���˘���G�ن迓�R�Γ���FOvl֕�e>H�Mn��?Z��h�����_7���o>��#�&	���9�*ƅB�K�(���g����S�m;��<?�Q%�'CӢA���0�`��_h����;���z��q�.´�X_X8A%�=�o(҂�o?6�5a1��!��r�ªh�i=�<�hDfΰ{;h��?kMk�`�k�w��g�6k���T���^�v�w��D�.h��)�s��J�����1�`���N��cO�8���M�-N}uqu��O��眂t#��%��B_�T�)���_L򶳭�j"A�r�	P�<���9�7��L���Ж�|_:Ӭ����Js>�A2/0��Q%��'�8Y������Q~r)�N*S{�:�V1ZkqQ�b�f3m��J=���0���~�v,�1��:Ȓ��r�a��#��6�y����{2[��к��Ʀ�z����z;E9��2K��+�b��h�gm}yR�X�8I:���d!�Xnl�횉2*�)
�;P�D	�P�F�T�R�jS9��S����Q˧4��fw��܎��zr�9D
�0�jW�	�� +  Ƚl�ߣ��:VG��"�)L*.ێxZ��ҭ=V�o`#�h�We=���Di":5��B�������@H���[�˛/��)ڝJ�3!�/mh�,�Ä�mÑC¤Z���O���hǰ2�|�6��kj !�mv���06h�m$�^�ZC����w�{,��Y�s���	��+4�<.Ц�0����G����Go��1qa�cް{Rh�2�L��j" f��� ��j�4��@fe�gN�����|�Ēc;���tl�?�1�P�vP�O��f=�ڟe���v��$�g��D6L~�˯��Y�|mn
;7��5ɠ�LF�Jsq��d�1R��)�[��9%kKv�ZG�����:��S�3���$έp�rl_���[��}\�kWG�>("u�џ��{~��d�v<�k7J����",f�T�!z�C�����9�%N�P������:�
^ 4��9u��5�4��0�T��;�=A�Z0���qͺ�T��8��(���¹�Sp��T�P!]���2]ť���U}�F��俭�;���d t}     