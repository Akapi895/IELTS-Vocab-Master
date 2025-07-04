import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WordPreview from "@/components/WordPreview";
import { getUserVocabList, getUserDueVocab, editUserVocab } from "@/services/api";
import { playAudio } from "@/services/playAudio";

// Thêm import Dialog nếu dùng shadcn/ui
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

interface Vocab {
  id: number;
  word: string;
  part_of_speech: string;
  pronunciation: string;
  phonetic: string;
  definition: string;
  example: string;
  translation: string;
  example_translation: string;
}

interface UserVocabItem {
  user_vocab: any;
  vocab: Vocab;
}

const VocabularyList: React.FC = () => {
  const [tab, setTab] = useState<"all" | "due">("all");
  const [allVocabs, setAllVocabs] = useState<UserVocabItem[]>([]);
  const [dueVocabs, setDueVocabs] = useState<UserVocabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState<Vocab | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editExample, setEditExample] = useState("");
  const [editExampleTrans, setEditExampleTrans] = useState("");
  const [editTranslation, setEditTranslation] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const navigate = useNavigate();

  const fetchVocabs = async (type: "all" | "due") => {
    setLoading(true);
    try {
      if (type === "all") {
        const data = await getUserVocabList();
        setAllVocabs(data);
        console.log("All Vocabs:", data);
      } else {
        const data = await getUserDueVocab();
        setDueVocabs(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabs("all");
  }, []);

  useEffect(() => {
    if (tab === "due" && dueVocabs.length === 0) fetchVocabs("due");
  }, [tab]);

  const vocabsToShow = tab === "all" ? allVocabs : dueVocabs;

  useEffect(() => {
    if (popupOpen && selectedVocab) {
      playAudio(selectedVocab.word, selectedVocab.pronunciation);
    }
  }, [popupOpen, selectedVocab]);

  useEffect(() => {
    if (popupOpen && selectedVocab) {
      setEditMode(false);
      setEditExample(selectedVocab.example || "");
      setEditExampleTrans(selectedVocab.example_translation || "");
      setEditTranslation(selectedVocab.translation || "");
    }
  }, [popupOpen, selectedVocab]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <Tabs value={tab} onValueChange={(val) => setTab(val as "all" | "due")}>
          <TabsList>
            <TabsTrigger value="all">All Words</TabsTrigger>
            <TabsTrigger value="due">Due Review</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => navigate("/vocabularyreview")} className="bg-emerald-600 text-white">
          Review Now
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : vocabsToShow.length === 0 ? (
        <div className="text-center text-gray-400">No vocabulary found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {vocabsToShow.map((item) => (
            <Card
              key={item.vocab.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={(e) => {
                const tag = (e.target as HTMLElement).tagName.toLowerCase();
                if (["button", "svg", "path"].includes(tag)) return;
                setSelectedVocab(item.vocab);
                setPopupOpen(true);
              }}
            >
              <WordPreview
                word={item.vocab.word.replace(/_/g, " ")}
                phonetic={item.vocab.phonetic}
                pronunciation={item.vocab.pronunciation}
              />
              <div className="text-xs text-gray-500 px-4 pb-4 italic">
                {item.vocab.part_of_speech}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Popup hiển thị thông tin từ */}
      {selectedVocab && (
        <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <WordPreview
                    word={selectedVocab.word.replace(/_/g, " ")}
                    phonetic={selectedVocab.phonetic}
                    pronunciation={selectedVocab.pronunciation}
                  />
                </DialogTitle>
                {!editMode && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditMode(true)}
                    className="ml-2"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <b>Part of speech:</b> {selectedVocab.part_of_speech}
              </div>

              <div>
                <b>Definition:</b> {selectedVocab.definition}
              </div>

              {editMode ? (
                <>
                  <div>
                    <b>Translation: </b>
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editTranslation}
                      onChange={e => setEditTranslation(e.target.value)}
                    />
                  </div>
                  <div>
                    <b>Example: </b>
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editExample}
                      onChange={e => setEditExample(e.target.value)}
                    />
                  </div>
                  <div>
                    <b>Example translation:</b>
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editExampleTrans}
                      onChange={e => setEditExampleTrans(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      disabled={editLoading}
                      onClick={async () => {
                        if (!selectedVocab) return;
                        setEditLoading(true);
                        try {
                          const userVocabItem =
                            allVocabs.find(item => item.vocab.id === selectedVocab.id) ||
                            dueVocabs.find(item => item.vocab.id === selectedVocab.id);
                          if (!userVocabItem) throw new Error("Không tìm thấy user_vocab_id");
                          await editUserVocab({
                            user_vocab_id: userVocabItem.user_vocab.id,
                            word: selectedVocab.word,
                            part_of_speech: selectedVocab.part_of_speech,
                            definition: selectedVocab.definition,
                            example: editExample,
                            pronunciation: selectedVocab.pronunciation,
                            phonetic: selectedVocab.phonetic,
                            translation: editTranslation,
                            example_translation: editExampleTrans,
                          });
                          await fetchVocabs("all");
                          await fetchVocabs("due");
                          setEditMode(false);
                          setPopupOpen(false); 
                        } catch (err) {
                          alert("Cập nhật thất bại");
                        } finally {
                          setEditLoading(false);
                        }
                      }}
                    >
                      Lưu
                    </Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>
                      Hủy
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {selectedVocab.translation && (
                    <div>
                      <b>Translation: </b>
                      <i>{selectedVocab.translation}</i>
                    </div>
                  )}
                  {selectedVocab.example && (
                    <div>
                      <b>Example: </b>{selectedVocab.example}
                    </div>
                  )}
                  {selectedVocab.example_translation && (
                    <div>
                      <b>Example translation:</b>{" "}
                      <i>{selectedVocab.example_translation}</i>
                    </div>
                  )}
                </>
              )}

              {/* Nút đóng */}
              <div />

              <DialogClose asChild>
                <Button className="w-full mt-10">Đóng</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default VocabularyList;
